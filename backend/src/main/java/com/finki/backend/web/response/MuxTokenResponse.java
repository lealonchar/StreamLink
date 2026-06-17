package com.finki.backend.web.response;

import lombok.Builder;

@Builder
public record MuxTokenResponse(
        String token,
        String spaceId
) {
}
