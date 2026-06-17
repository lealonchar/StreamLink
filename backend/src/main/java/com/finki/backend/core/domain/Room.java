package com.finki.backend.core.domain;

import com.finki.backend.core.domain.enums.RoomStatus;
import jakarta.persistence.*;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Entity
@Table(name = "rooms")
@Getter
@Setter
@NoArgsConstructor
public class Room extends BaseAuditableEntity {

    @Column(nullable = false)
    private String name;

    @Column(length = 500)
    private String description;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    private User createdBy;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private RoomStatus status = RoomStatus.ACTIVE;

    @Column(name = "mux_space_id")
    private String muxSpaceId;

    public Room(String name, String description, User createdBy, String muxSpaceId) {
        this.name = name;
        this.description = description;
        this.createdBy = createdBy;
        this.muxSpaceId = muxSpaceId;
    }
}
