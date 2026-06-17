package com.finki.backend.core.constants;

public final class MuxConstants {

    private MuxConstants() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    public static final String MUX_API_BASE_PATH = "/video/v1";
    public static final String SPACES_PATH = MUX_API_BASE_PATH + "/spaces";
    public static final String PARTICIPANTS_PATH = "/participants";
    public static final String MUX_SPACE_TYPE = "mux";
    public static final String MUX_PARTICIPANT_PUBLISHER = "publisher";
}
