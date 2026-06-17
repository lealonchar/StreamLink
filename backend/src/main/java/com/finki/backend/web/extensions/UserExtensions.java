package com.finki.backend.web.extensions;

import com.finki.backend.core.domain.User;
import com.finki.backend.web.response.UserResponse;

public final class UserExtensions {

    private UserExtensions() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    public static UserResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserResponse.builder()
                .id(user.getId())
                .username(user.getUsername())
                .name(user.getName())
                .createdAt(user.getCreatedAt())
                .build();
    }
}
