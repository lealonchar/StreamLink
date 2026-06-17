package com.finki.backend.core.constants;

public final class ApiConstants {

    private ApiConstants() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    public static final String API_BASE_PATH = "/api";
    public static final String AUTH_PATH = API_BASE_PATH + "/auth";
    public static final String ROOMS_PATH = API_BASE_PATH + "/rooms";
    public static final String INVITES_PATH = API_BASE_PATH + "/invites";
    public static final String USERS_PATH = API_BASE_PATH + "/users";
    public static final String MUX_PATH = API_BASE_PATH + "/mux";
}
