package com.finki.backend.web.response;

import com.finki.backend.core.domain.enums.RoomStatus;
import lombok.Builder;

import java.time.Instant;
import java.util.List;

@Builder
public record RoomDetailResponse(
        Long id,
        String name,
        String description,
        RoomStatus status,
        UserResponse createdBy,
        List<ParticipantResponse> participants,
        Instant createdAt
) {
}
