package com.finki.backend.core.repository;

import com.finki.backend.core.domain.RoomParticipant;
import com.finki.backend.core.domain.enums.ParticipantRole;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.Instant;
import java.util.List;
import java.util.Optional;

@Repository
public interface RoomParticipantRepository extends JpaRepository<RoomParticipant, Long> {

    @EntityGraph(attributePaths = {"user"})
    @Query("SELECT rp FROM RoomParticipant rp WHERE rp.room.id = :roomId AND rp.leftAt IS NULL")
    List<RoomParticipant> findActiveByRoomId(@Param("roomId") Long roomId);

    @EntityGraph(attributePaths = {"room", "user"})
    @Query("SELECT rp FROM RoomParticipant rp WHERE rp.room.id = :roomId AND rp.user.id = :userId AND rp.leftAt IS NULL")
    Optional<RoomParticipant> findActiveByRoomAndUser(@Param("roomId") Long roomId, @Param("userId") Long userId);

    @Query("SELECT COUNT(rp) > 0 FROM RoomParticipant rp WHERE rp.room.id = :roomId AND rp.user.id = :userId AND rp.role = :role AND rp.leftAt IS NULL")
    boolean existsActiveHost(@Param("roomId") Long roomId, @Param("userId") Long userId, @Param("role") ParticipantRole role);

    @Modifying
    @Query("UPDATE RoomParticipant rp SET rp.leftAt = :leftAt WHERE rp.room.id = :roomId AND rp.user.id = :userId AND rp.leftAt IS NULL")
    int markLeftByRoomAndUser(@Param("roomId") Long roomId, @Param("userId") Long userId, @Param("leftAt") Instant leftAt);

    @Modifying
    @Query("UPDATE RoomParticipant rp SET rp.leftAt = :leftAt WHERE rp.room.id = :roomId AND rp.leftAt IS NULL")
    int markAllLeftByRoom(@Param("roomId") Long roomId, @Param("leftAt") Instant leftAt);
}
