package com.finki.backend.web.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record JoinInviteAsGuestRequest(
        @NotBlank(message = "Name is required")
        @Size(min = 1, max = 100, message = "Name must be between 1 and 100 characters")
        String name
) {
}
