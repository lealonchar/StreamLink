package com.finki.backend.web.request;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record CreateRoomRequest(
        @NotBlank(message = "Room name is required")
        @Size(min = 1, max = 100, message = "Room name must be between 1 and 100 characters")
        String name,

        @Size(max = 500, message = "Description must be at most 500 characters")
        String description
) {
}
