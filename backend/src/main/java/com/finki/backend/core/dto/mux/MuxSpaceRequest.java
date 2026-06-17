package com.finki.backend.core.dto.mux;

import lombok.Builder;

@Builder
public record MuxSpaceRequest(
        String id
) {
}
