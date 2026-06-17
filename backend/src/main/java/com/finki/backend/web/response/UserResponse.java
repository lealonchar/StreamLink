package com.finki.backend.web.response;

import lombok.Builder;

import java.time.Instant;

@Builder
public record UserResponse(
        Long id,
        String username,
        String name,
        Instant createdAt
) {
}
