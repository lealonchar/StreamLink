package com.finki.backend.core.dto.mux;

import com.fasterxml.jackson.annotation.JsonProperty;
import lombok.Builder;

@Builder
public record MuxParticipantRequest(
        @JsonProperty("display_name") String displayName
) {
}
