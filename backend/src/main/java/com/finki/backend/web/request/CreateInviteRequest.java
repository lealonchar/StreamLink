package com.finki.backend.web.request;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;

public record CreateInviteRequest(
        @Min(value = 1, message = "Max uses must be at least 1")
        @Max(value = 1000, message = "Max uses must be at most 1000")
        Integer maxUses,

        @Min(value = 1, message = "Expiry hours must be at least 1")
        @Max(value = 720, message = "Expiry hours must be at most 720 (30 days)")
        Integer expiryHours
) {
}
