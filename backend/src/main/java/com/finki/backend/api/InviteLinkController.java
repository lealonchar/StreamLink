package com.finki.backend.api;

import com.finki.backend.core.constants.ApiConstants;
import com.finki.backend.core.domain.InviteLink;
import com.finki.backend.core.domain.Room;
import com.finki.backend.core.security.UserPrincipal;
import com.finki.backend.core.service.InviteLinkService;
import com.finki.backend.core.service.RoomService;
import com.finki.backend.web.extensions.InviteLinkExtensions;
import com.finki.backend.web.extensions.RoomExtensions;
import com.finki.backend.web.request.CreateInviteRequest;
import com.finki.backend.web.response.InviteLinkResponse;
import com.finki.backend.web.response.RoomResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequiredArgsConstructor
public class InviteLinkController {

    private final InviteLinkService inviteLinkService;
    private final RoomService roomService;

    @PostMapping(ApiConstants.ROOMS_PATH + "/{roomId}/invites")
    public ResponseEntity<InviteLinkResponse> createInvite(
            @PathVariable Long roomId,
            @Valid @RequestBody CreateInviteRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        InviteLink invite = inviteLinkService.createInvite(
                roomId,
                principal.getUserId(),
                request.maxUses(),
                request.expiryHours()
        );
        return ResponseEntity.status(HttpStatus.CREATED).body(InviteLinkExtensions.toResponse(invite));
    }

    @GetMapping(ApiConstants.ROOMS_PATH + "/{roomId}/invites")
    public ResponseEntity<List<InviteLinkResponse>> getRoomInvites(
            @PathVariable Long roomId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        // Verify user is host
        roomService.getRoomById(roomId); // validates room exists
        if (!roomService.isHost(roomId, principal.getUserId())) {
            throw new com.finki.backend.core.exception.ForbiddenException("Only the room host can view invite links");
        }
        List<InviteLinkResponse> invites = inviteLinkService.getRoomInvites(roomId).stream()
                .map(InviteLinkExtensions::toResponse)
                .toList();
        return ResponseEntity.ok(invites);
    }

    @GetMapping(ApiConstants.INVITES_PATH + "/{token}")
    public ResponseEntity<InviteLinkResponse> getInviteByToken(
            @PathVariable String token
    ) {
        InviteLink invite = inviteLinkService.getInviteByToken(token);
        return ResponseEntity.ok(InviteLinkExtensions.toResponse(invite));
    }

    @PostMapping(ApiConstants.INVITES_PATH + "/{token}/join")
    public ResponseEntity<RoomResponse> joinByInvite(
            @PathVariable String token,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Room room = inviteLinkService.joinByInvite(token, principal.getUserId());
        return ResponseEntity.ok(RoomExtensions.toResponse(room));
    }

    @DeleteMapping(ApiConstants.INVITES_PATH + "/{inviteId}")
    public ResponseEntity<Void> revokeInvite(
            @PathVariable Long inviteId,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        inviteLinkService.revokeInvite(inviteId, principal.getUserId());
        return ResponseEntity.noContent().build();
    }
}
