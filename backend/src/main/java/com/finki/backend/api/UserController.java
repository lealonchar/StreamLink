package com.finki.backend.api;

import com.finki.backend.core.constants.ApiConstants;
import com.finki.backend.core.domain.User;
import com.finki.backend.core.security.UserPrincipal;
import com.finki.backend.core.service.UserService;
import com.finki.backend.web.extensions.UserExtensions;
import com.finki.backend.web.response.UserResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(ApiConstants.USERS_PATH)
@RequiredArgsConstructor
public class UserController {

    private final UserService userService;

    @GetMapping("/me")
    public ResponseEntity<UserResponse> getCurrentUser(
            @AuthenticationPrincipal UserPrincipal principal
    ) {
        User user = userService.getUserById(principal.getUserId());
        return ResponseEntity.ok(UserExtensions.toResponse(user));
    }
}
