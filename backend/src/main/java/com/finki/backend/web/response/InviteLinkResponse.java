package com.finki.backend.web.response;

import com.finki.backend.core.domain.enums.InviteStatus;
import lombok.Builder;

import java.time.Instant;

@Builder
public record InviteLinkResponse(
        Long id,
        Long roomId,
        String token,
        InviteStatus status,
        Instant expiresAt,
        Integer maxUses,
        Integer useCount,
        UserResponse createdBy,
        Instant createdAt
) {
}
