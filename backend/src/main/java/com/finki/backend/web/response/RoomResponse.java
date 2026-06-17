package com.finki.backend.web.response;

import com.finki.backend.core.domain.enums.RoomStatus;
import lombok.Builder;

import java.time.Instant;

@Builder
public record RoomResponse(
        Long id,
        String name,
        String description,
        RoomStatus status,
        UserResponse createdBy,
        Instant createdAt
) {
}
