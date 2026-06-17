package com.finki.backend.web.extensions;

import com.finki.backend.core.domain.InviteLink;
import com.finki.backend.web.response.InviteLinkResponse;

public final class InviteLinkExtensions {

    private InviteLinkExtensions() {
        throw new AssertionError("Utility class should not be instantiated");
    }

    public static InviteLinkResponse toResponse(InviteLink invite) {
        if (invite == null) {
            return null;
        }

        return InviteLinkResponse.builder()
                .id(invite.getId())
                .roomId(invite.getRoom().getId())
                .token(invite.getToken())
                .status(invite.getStatus())
                .expiresAt(invite.getExpiresAt())
                .maxUses(invite.getMaxUses())
                .useCount(invite.getUseCount())
                .createdBy(UserExtensions.toResponse(invite.getCreatedBy()))
                .createdAt(invite.getCreatedAt())
                .build();
    }
}
