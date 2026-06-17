package com.finki.backend.core.constants;

public final class AppConstants {

    private AppConstants() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    public static final String DEFAULT_TIMEZONE = "UTC";
    public static final int MAX_PAGE_SIZE = 100;
    public static final int DEFAULT_PAGE_SIZE = 20;
    public static final String INVITE_TOKEN_ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
    public static final int INVITE_TOKEN_LENGTH = 16;
    public static final int INVITE_DEFAULT_MAX_USES = 50;
    public static final int INVITE_DEFAULT_EXPIRY_HOURS = 168; // 7 days
}
