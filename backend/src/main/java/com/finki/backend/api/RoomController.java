package com.finki.backend.api;

import com.finki.backend.core.constants.ApiConstants;
import com.finki.backend.core.domain.Room;
import com.finki.backend.core.domain.RoomParticipant;
import com.finki.backend.core.security.UserPrincipal;
import com.finki.backend.core.service.LiveKitService;
import com.finki.backend.core.service.RoomService;
import com.finki.backend.web.extensions.RoomExtensions;
import com.finki.backend.web.request.CreateRoomRequest;
import com.finki.backend.web.response.LiveKitTokenResponse;
import com.finki.backend.web.response.RoomDetailResponse;
import com.finki.backend.web.response.RoomResponse;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(ApiConstants.ROOMS_PATH)
@RequiredArgsConstructor
public class RoomController {

    private final RoomService roomService;
    private final LiveKitService liveKitService;

    @GetMapping
    public ResponseEntity<List<RoomResponse>> getAllActiveRooms() {
        List<RoomResponse> rooms = roomService.getAllActiveRooms().stream()
                .map(RoomExtensions::toResponse)
                .toList();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/my")
    public ResponseEntity<List<RoomResponse>> getMyRooms(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        List<RoomResponse> rooms = roomService.getMyRooms(principal.getUserId()).stream()
                .map(RoomExtensions::toResponse)
                .toList();
        return ResponseEntity.ok(rooms);
    }

    @GetMapping("/{id}")
    public ResponseEntity<RoomDetailResponse> getRoomById(
            @PathVariable Long id
    ) {
        Room room = roomService.getRoomById(id);
        List<RoomParticipant> participants = roomService.getActiveParticipants(id);
        return ResponseEntity.ok(RoomExtensions.toDetailResponse(room, participants));
    }

    @PostMapping
    public ResponseEntity<RoomResponse> createRoom(
            @Valid @RequestBody CreateRoomRequest request,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Room room = roomService.createRoom(principal.getUserId(), request.name(), request.description());
        return ResponseEntity.status(HttpStatus.CREATED).body(RoomExtensions.toResponse(room));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> closeRoom(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        roomService.closeRoom(id, principal.getUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<RoomResponse> joinRoom(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Room room = roomService.joinRoom(id, principal.getUserId());
        return ResponseEntity.ok(RoomExtensions.toResponse(room));
    }

    @PostMapping("/{id}/leave")
    public ResponseEntity<Void> leaveRoom(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        roomService.leaveRoom(id, principal.getUserId());
        return ResponseEntity.noContent().build();
    }

    @PostMapping("/{id}/token")
    public ResponseEntity<LiveKitTokenResponse> getLiveKitToken(
            @PathVariable Long id,
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        Room room = roomService.getActiveRoomForParticipant(id, principal.getUserId());
        String participantIdentity = "user-" + principal.getUserId();

        String token = liveKitService.createParticipantToken(
                room.getLivekitRoomName(),
                participantIdentity,
                principal.getName()
        );

        return ResponseEntity.ok(LiveKitTokenResponse.builder()
                .token(token)
                .serverUrl(liveKitService.getLiveKitUrl())
                .roomName(room.getLivekitRoomName())
                .build());
    }
}
