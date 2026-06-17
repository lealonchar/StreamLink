package com.finki.backend.core.service;

import com.finki.backend.core.domain.Room;
import com.finki.backend.core.domain.RoomParticipant;
import com.finki.backend.core.domain.User;
import com.finki.backend.core.domain.enums.ParticipantRole;
import com.finki.backend.core.domain.enums.RoomStatus;
import com.finki.backend.core.exception.BadRequestException;
import com.finki.backend.core.exception.ForbiddenException;
import com.finki.backend.core.exception.ResourceNotFoundException;
import com.finki.backend.core.repository.RoomParticipantRepository;
import com.finki.backend.core.repository.RoomRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.Instant;
import java.util.List;

@Slf4j
@Service
@RequiredArgsConstructor
public class RoomService {

    private final RoomRepository roomRepository;
    private final RoomParticipantRepository roomParticipantRepository;
    private final UserService userService;
    private final MuxService muxService;

    @Transactional(readOnly = true)
    public List<Room> getAllActiveRooms() {
        return roomRepository.findAllByStatus(RoomStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public List<Room> getMyRooms(Long userId) {
        return roomRepository.findAllByCreatorAndStatus(userId, RoomStatus.ACTIVE);
    }

    @Transactional(readOnly = true)
    public Room getRoomById(Long roomId) {
        return roomRepository.findByIdWithCreator(roomId)
                .orElseThrow(() -> new ResourceNotFoundException("Room", roomId));
    }

    @Transactional
    public Room createRoom(Long userId, String name, String description) {
        User user = userService.getUserById(userId);

        String muxSpaceId = muxService.createSpace(name);

        Room room = new Room(name, description, user, muxSpaceId);
        Room savedRoom = roomRepository.save(room);

        RoomParticipant hostParticipant = new RoomParticipant(savedRoom, user, ParticipantRole.HOST);
        roomParticipantRepository.save(hostParticipant);

        log.info("User {} created room {} with Mux space {}", userId, savedRoom.getId(), muxSpaceId);
        return savedRoom;
    }

    @Transactional
    public void closeRoom(Long roomId, Long userId) {
        Room room = getRoomById(roomId);

        if (!roomRepository.existsByIdAndCreatorId(roomId, userId)) {
            throw new ForbiddenException("Only the room host can close this room");
        }

        if (room.getStatus() == RoomStatus.CLOSED) {
            throw new BadRequestException("Room is already closed");
        }

        roomParticipantRepository.markAllLeftByRoom(roomId, Instant.now());

        room.setStatus(RoomStatus.CLOSED);
        roomRepository.save(room);

        if (room.getMuxSpaceId() != null) {
            muxService.deleteSpace(room.getMuxSpaceId());
        }

        log.info("User {} closed room {}", userId, roomId);
    }

    @Transactional
    public Room joinRoom(Long roomId, Long userId) {
        Room room = getRoomById(roomId);

        if (room.getStatus() != RoomStatus.ACTIVE) {
            throw new BadRequestException("Room is not active");
        }

        roomParticipantRepository.findActiveByRoomAndUser(roomId, userId)
                .ifPresent(p -> {
                    throw new BadRequestException("You are already in this room");
                });

        User user = userService.getUserById(userId);

        RoomParticipant participant = new RoomParticipant(room, user, ParticipantRole.PARTICIPANT);
        roomParticipantRepository.save(participant);

        log.info("User {} joined room {}", userId, roomId);
        return room;
    }

    @Transactional
    public void leaveRoom(Long roomId, Long userId) {
        getRoomById(roomId);

        int updated = roomParticipantRepository.markLeftByRoomAndUser(roomId, userId, Instant.now());
        if (updated == 0) {
            throw new ResourceNotFoundException("Room participant", "roomId=" + roomId + ", userId=" + userId);
        }

        log.info("User {} left room {}", userId, roomId);
    }

    @Transactional(readOnly = true)
    public boolean isHost(Long roomId, Long userId) {
        return roomParticipantRepository.existsActiveHost(
                roomId, userId, ParticipantRole.HOST
        );
    }

    @Transactional(readOnly = true)
    public List<RoomParticipant> getActiveParticipants(Long roomId) {
        return roomParticipantRepository.findActiveByRoomId(roomId);
    }
}
