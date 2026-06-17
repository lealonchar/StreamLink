package com.finki.backend.core.dto.mux;

import com.fasterxml.jackson.annotation.JsonProperty;

public record MuxParticipantResponse(
        MuxParticipantData data
) {
    public record MuxParticipantData(
            String id,
            @JsonProperty("display_name") String displayName,
            @JsonProperty("join_token") String joinToken,
            @JsonProperty("space_id") String spaceId,
            @JsonProperty("created_at") String createdAt,
            @JsonProperty("updated_at") String updatedAt
    ) {
    }
}
