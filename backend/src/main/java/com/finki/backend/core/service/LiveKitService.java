package com.finki.backend.core.service;

import com.finki.backend.core.exception.BadRequestException;
import io.livekit.server.AccessToken;
import io.livekit.server.RoomJoin;
import io.livekit.server.RoomName;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class LiveKitService {

    @Value("${livekit.api.key}")
    private String livekitApiKey;

    @Value("${livekit.api.secret}")
    private String livekitApiSecret;

    @Value("${livekit.url}")
    private String livekitUrl;

    public String createRoomName() {
        return "room-" + UUID.randomUUID();
    }

    public String createParticipantToken(String roomName, String participantIdentity, String displayName) {
        try {
            AccessToken token = new AccessToken(livekitApiKey, livekitApiSecret);
            token.setName(displayName);
            token.setIdentity(participantIdentity);
            token.addGrants(new RoomJoin(true), new RoomName(roomName));

            String jwt = token.toJwt();
            log.info("Created LiveKit participant token for room: {} participant: {}", roomName, participantIdentity);
            return jwt;

        } catch (Exception e) {
            log.error("LiveKit token generation error for room: {} user: {}", roomName, displayName, e);
            throw new BadRequestException("Failed to create video call token. Please try again.");
        }
    }

    public String getLiveKitUrl() {
        return livekitUrl;
    }
}
