package com.finki.backend.core.constants;

public final class SecurityConstants {

    private SecurityConstants() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    public static final String BEARER_PREFIX = "Bearer ";
    public static final String AUTHORIZATION_HEADER = "Authorization";
    public static final String TOKEN_TYPE = "JWT";
    public static final String ROLE_USER = "ROLE_USER";

}
