package com.finki.backend.web.response;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public record AuthResponse(
        String token,
        @JsonProperty("token_type")
        String tokenType,
        @JsonProperty("expires_in")
        Long expiresIn,
        @JsonProperty("user_id")
        Long userId,
        String username,
        String name
) {
}
