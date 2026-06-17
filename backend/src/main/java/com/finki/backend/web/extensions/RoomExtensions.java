package com.finki.backend.web.extensions;

import com.finki.backend.core.domain.Room;
import com.finki.backend.core.domain.RoomParticipant;
import com.finki.backend.web.response.ParticipantResponse;
import com.finki.backend.web.response.RoomDetailResponse;
import com.finki.backend.web.response.RoomResponse;

import java.util.List;

public final class RoomExtensions {

    private RoomExtensions() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    public static RoomResponse toResponse(Room room) {
        if (room == null) {
            return null;
        }

        return RoomResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .description(room.getDescription())
                .status(room.getStatus())
                .createdBy(UserExtensions.toResponse(room.getCreatedBy()))
                .createdAt(room.getCreatedAt())
                .build();
    }

    public static RoomDetailResponse toDetailResponse(Room room, List<RoomParticipant> participants) {
        if (room == null) {
            return null;
        }

        List<ParticipantResponse> participantResponses = participants.stream()
                .map(RoomExtensions::toParticipantResponse)
                .toList();

        return RoomDetailResponse.builder()
                .id(room.getId())
                .name(room.getName())
                .description(room.getDescription())
                .status(room.getStatus())
                .createdBy(UserExtensions.toResponse(room.getCreatedBy()))
                .participants(participantResponses)
                .createdAt(room.getCreatedAt())
                .build();
    }

    public static ParticipantResponse toParticipantResponse(RoomParticipant participant) {
        if (participant == null) {
            return null;
        }

        return ParticipantResponse.builder()
                .id(participant.getId())
                .user(UserExtensions.toResponse(participant.getUser()))
                .role(participant.getRole())
                .joinedAt(participant.getJoinedAt())
                .build();
    }
}
