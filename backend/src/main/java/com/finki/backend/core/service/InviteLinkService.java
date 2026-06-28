package com.finki.backend.core.service;

import com.finki.backend.core.constants.AppConstants;
import com.finki.backend.core.domain.InviteLink;
import com.finki.backend.core.domain.Room;
import com.finki.backend.core.domain.RoomParticipant;
import com.finki.backend.core.domain.User;
import com.finki.backend.core.domain.enums.InviteStatus;
import com.finki.backend.core.domain.enums.ParticipantRole;
import com.finki.backend.core.exception.BadRequestException;
import com.finki.backend.core.exception.ForbiddenException;
import com.finki.backend.core.exception.ResourceNotFoundException;
import com.finki.backend.core.exception.UnauthorizedException;
import com.finki.backend.core.repository.InviteLinkRepository;
import com.finki.backend.core.repository.RoomParticipantRepository;
import com.finki.backend.core.repository.UserRepository;
import com.finki.backend.core.security.JwtService;
import com.finki.backend.web.response.AuthResponse;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.Instant;
import java.time.temporal.ChronoUnit;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class InviteLinkService {

    private final InviteLinkRepository inviteLinkRepository;
    private final RoomParticipantRepository roomParticipantRepository;
    private final RoomService roomService;
    private final UserService userService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;
    private final SecureRandom secureRandom = new SecureRandom();

    @Transactional(readOnly = true)
    public InviteLink getInviteByToken(String token) {
        return inviteLinkRepository.findByToken(token)
                .orElseThrow(() -> new ResourceNotFoundException("Invite link", token));
    }

    @Transactional(readOnly = true)
    public List<InviteLink> getRoomInvites(Long roomId) {
        return inviteLinkRepository.findAllByRoomId(roomId);
    }

    @Transactional
    public InviteLink createInvite(Long roomId, Long createdByUserId, Integer maxUses, Integer expiryHours) {
        Room room = roomService.getRoomById(roomId);

        if (!room.getCreatedBy().getId().equals(createdByUserId)) {
            throw new ForbiddenException("Only the room host can create invite links");
        }

        if (room.getStatus() != com.finki.backend.core.domain.enums.RoomStatus.ACTIVE) {
            throw new BadRequestException("Cannot create invites for closed rooms");
        }

        User creator = userService.getUserById(createdByUserId);

        String token = generateToken();
        Instant expiresAt = Instant.now().plus(
                expiryHours != null ? expiryHours : AppConstants.INVITE_DEFAULT_EXPIRY_HOURS,
                ChronoUnit.HOURS
        );

        InviteLink invite = new InviteLink(room, token, expiresAt, maxUses != null ? maxUses : AppConstants.INVITE_DEFAULT_MAX_USES, creator);
        InviteLink saved = inviteLinkRepository.save(invite);

        log.info("Created invite link {} for room {} by user {}", token, roomId, createdByUserId);
        return saved;
    }

    @Transactional
    public Room joinByInvite(String token, Long userId) {
        InviteLink invite = validateInvite(token);
        Room room = invite.getRoom();

        User user = userService.getUserById(userId);

        roomParticipantRepository.findActiveByRoomAndUser(room.getId(), userId)
                .ifPresent(p -> {
                    throw new BadRequestException("You are already in this room");
                });

        addParticipantAndConsumeInvite(room, user, invite);

        log.info("User {} joined room {} via invite {}", userId, room.getId(), token);
        return room;
    }

    @Transactional
    public AuthResponse joinByInviteAsGuest(String token, String guestName) {
        InviteLink invite = validateInvite(token);
        Room room = invite.getRoom();

        String username = generateGuestUsername();
        while (userRepository.existsByUsername(username)) {
            username = generateGuestUsername();
        }

        String encodedPassword = passwordEncoder.encode(UUID.randomUUID().toString());
        User guest = new User(username, encodedPassword, guestName.trim());
        userRepository.save(guest);

        addParticipantAndConsumeInvite(room, guest, invite);

        String jwt = jwtService.generateToken(guest.getId(), guest.getUsername());

        log.info("Guest user {} joined room {} via invite {}", guest.getId(), room.getId(), token);

        return AuthResponse.builder()
                .token(jwt)
                .tokenType("Bearer")
                .expiresIn(86400L)
                .userId(guest.getId())
                .username(guest.getUsername())
                .name(guest.getName())
                .build();
    }

    private InviteLink validateInvite(String token) {
        InviteLink invite = getInviteByToken(token);

        if (invite.getStatus() != InviteStatus.ACTIVE) {
            throw new UnauthorizedException("This invite link is " + invite.getStatus().toString().toLowerCase());
        }

        if (invite.getExpiresAt() != null && invite.getExpiresAt().isBefore(Instant.now())) {
            invite.setStatus(InviteStatus.EXPIRED);
            inviteLinkRepository.save(invite);
            throw new UnauthorizedException("This invite link has expired");
        }

        if (invite.getMaxUses() != null && invite.getUseCount() >= invite.getMaxUses()) {
            invite.setStatus(InviteStatus.USED);
            inviteLinkRepository.save(invite);
            throw new UnauthorizedException("This invite link has reached its maximum number of uses");
        }

        Room room = invite.getRoom();

        if (room.getStatus() != com.finki.backend.core.domain.enums.RoomStatus.ACTIVE) {
            throw new BadRequestException("This room is no longer active");
        }

        return invite;
    }

    private void addParticipantAndConsumeInvite(Room room, User user, InviteLink invite) {
        roomParticipantRepository.findActiveByRoomAndUser(room.getId(), user.getId())
                .ifPresent(p -> {
                    throw new BadRequestException("You are already in this room");
                });

        RoomParticipant participant = new RoomParticipant(room, user, ParticipantRole.PARTICIPANT);
        roomParticipantRepository.save(participant);

        inviteLinkRepository.incrementUseCount(invite.getId());

        InviteLink updated = inviteLinkRepository.findById(invite.getId()).orElseThrow();
        if (updated.getMaxUses() != null && updated.getUseCount() >= updated.getMaxUses()) {
            updated.setStatus(InviteStatus.USED);
            updated.setUsedAt(Instant.now());
            inviteLinkRepository.save(updated);
        }
    }

    @Transactional
    public void revokeInvite(Long inviteId, Long userId) {
        InviteLink invite = inviteLinkRepository.findById(inviteId)
                .orElseThrow(() -> new ResourceNotFoundException("Invite link", inviteId));

        if (!invite.getRoom().getCreatedBy().getId().equals(userId)) {
            throw new ForbiddenException("Only the room host can revoke invite links");
        }

        invite.setStatus(InviteStatus.DISABLED);
        inviteLinkRepository.save(invite);
        log.info("User {} revoked invite {}", userId, inviteId);
    }

    @Scheduled(fixedRate = 300000)
    @Transactional
    public void expireOldInvites() {
        int expired = inviteLinkRepository.expireAllPastDue(Instant.now());
        if (expired > 0) {
            log.info("Expired {} invite links", expired);
        }
    }

    private String generateToken() {
        StringBuilder sb = new StringBuilder(AppConstants.INVITE_TOKEN_LENGTH);
        for (int i = 0; i < AppConstants.INVITE_TOKEN_LENGTH; i++) {
            sb.append(AppConstants.INVITE_TOKEN_ALPHABET.charAt(secureRandom.nextInt(AppConstants.INVITE_TOKEN_ALPHABET.length())));
        }
        return sb.toString();
    }

    private String generateGuestUsername() {
        return "guest-" + UUID.randomUUID().toString().replace("-", "").substring(0, 12);
    }
}
