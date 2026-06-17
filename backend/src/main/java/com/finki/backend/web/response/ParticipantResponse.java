package com.finki.backend.web.response;

import com.finki.backend.core.domain.enums.ParticipantRole;
import lombok.Builder;

import java.time.Instant;

@Builder
public record ParticipantResponse(
        Long id,
        UserResponse user,
        ParticipantRole role,
        Instant joinedAt
) {
}
