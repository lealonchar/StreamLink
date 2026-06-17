package com.finki.backend.core.domain;

import com.finki.backend.core.domain.enums.ParticipantRole;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;

import java.time.Instant;

@Entity
@Table(name = "room_participants", uniqueConstraints = {
        @UniqueConstraint(columnNames = {"room_id", "user_id"}, name = "uk_room_user")
})
@Getter
@Setter
@NoArgsConstructor
public class RoomParticipant extends BaseAuditableEntity {

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "room_id", nullable = false)
    private Room room;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private ParticipantRole role = ParticipantRole.PARTICIPANT;

    @CreationTimestamp
    @Column(name = "joined_at", nullable = false, updatable = false)
    private Instant joinedAt;

    @Column(name = "left_at")
    private Instant leftAt;

    public RoomParticipant(Room room, User user, ParticipantRole role) {
        this.room = room;
        this.user = user;
        this.role = role;
    }
}
