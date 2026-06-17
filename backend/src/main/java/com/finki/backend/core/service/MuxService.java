package com.finki.backend.core.service;

import com.finki.backend.core.dto.mux.MuxParticipantRequest;
import com.finki.backend.core.dto.mux.MuxParticipantResponse;
import com.finki.backend.core.dto.mux.MuxSpaceRequest;
import com.finki.backend.core.dto.mux.MuxSpaceResponse;
import com.finki.backend.core.exception.BadRequestException;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.*;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClientResponseException;
import org.springframework.web.client.RestTemplate;

import java.util.Base64;
import java.util.UUID;

@Slf4j
@Service
@RequiredArgsConstructor
public class MuxService {

    @Value("${mux.access-token-id}")
    private String muxAccessTokenId;

    @Value("${mux.secret-key}")
    private String muxSecretKey;

    @Value("${mux.base-url}")
    private String muxBaseUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String createSpace(String roomName) {
        String url = muxBaseUrl + "/video/v1/spaces";

        MuxSpaceRequest request = MuxSpaceRequest.builder()
                .id("room-" + UUID.randomUUID())
                .build();

        HttpEntity<MuxSpaceRequest> entity = new HttpEntity<>(request, createHeaders());

        try {
            ResponseEntity<MuxSpaceResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    MuxSpaceResponse.class
            );

            if (response.getBody() == null || response.getBody().data() == null) {
                throw new BadRequestException("Failed to create Mux space: empty response");
            }

            String spaceId = response.getBody().data().id();
            log.info("Created Mux space: {} for room: {}", spaceId, roomName);
            return spaceId;

        } catch (RestClientResponseException e) {
            log.error("Mux API error creating space: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new BadRequestException("Failed to create video space. Please try again.");
        }
    }

    public String createParticipantToken(String spaceId, String displayName) {
        String url = muxBaseUrl + "/video/v1/spaces/" + spaceId + "/participants";

        MuxParticipantRequest request = MuxParticipantRequest.builder()
                .displayName(displayName)
                .build();

        HttpEntity<MuxParticipantRequest> entity = new HttpEntity<>(request, createHeaders());

        try {
            ResponseEntity<MuxParticipantResponse> response = restTemplate.exchange(
                    url,
                    HttpMethod.POST,
                    entity,
                    MuxParticipantResponse.class
            );

            if (response.getBody() == null || response.getBody().data() == null) {
                throw new BadRequestException("Failed to create participant token: empty response");
            }

            String token = response.getBody().data().joinToken();
            log.info("Created participant token for space: {}", spaceId);
            return token;

        } catch (RestClientResponseException e) {
            log.error("Mux API error creating participant token: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new BadRequestException("Failed to create participant token. Please try again.");
        }
    }

    public void deleteSpace(String spaceId) {
        String url = muxBaseUrl + "/video/v1/spaces/" + spaceId;

        HttpEntity<Void> entity = new HttpEntity<>(createHeaders());

        try {
            restTemplate.exchange(url, HttpMethod.DELETE, entity, Void.class);
            log.info("Deleted Mux space: {}", spaceId);
        } catch (RestClientResponseException e) {
            log.error("Mux API error deleting space: {} - {}", e.getStatusCode(), e.getResponseBodyAsString());
        }
    }

    private HttpHeaders createHeaders() {
        HttpHeaders headers = new HttpHeaders();
        headers.setContentType(MediaType.APPLICATION_JSON);

        String credentials = muxAccessTokenId + ":" + muxSecretKey;
        String encodedCredentials = Base64.getEncoder().encodeToString(credentials.getBytes());
        headers.set("Authorization", "Basic " + encodedCredentials);

        return headers;
    }
}
