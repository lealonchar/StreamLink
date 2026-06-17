package com.finki.backend.core.domain;

import com.finki.backend.core.domain.enums.InviteStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.Instant;

@Entity
@Table(name = "invite_links")
@Getter
@Setter
@NoArgsConstructor
public class InviteLink extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @Column(nullable = false, unique = true, length = 64)
    private String token;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private InviteStatus status = InviteStatus.ACTIVE;

    @Column(name = "expires_at")
    private Instant expiresAt;

    @Column(name = "used_at")
    private Instant usedAt;

    @Column(name = "max_uses")
    private Integer maxUses = 1;

    @Column(name = "use_count", nullable = false)
    private Integer useCount = 0;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    public InviteLink(Room room, String token, Instant expiresAt, Integer maxUses, User createdBy) {
        this.room = room;
        this.token = token;
        this.expiresAt = expiresAt;
        this.maxUses = maxUses;
        this.createdBy = createdBy;
    }
}
