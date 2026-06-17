package com.finki.backend.core.dto.mux;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MuxSpaceResponse(
        MuxSpaceData data
) {
    public record MuxSpaceData(
            String id,
            @JsonProperty("created_at") String createdAt
    ) {
    }
}
