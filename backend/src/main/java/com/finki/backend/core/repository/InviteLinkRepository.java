package com.finki.backend.core.repository;

import com.finki.backend.core.domain.InviteLink;
import com.finki.backend.core.domain.enums.InviteStatus;
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
public interface InviteLinkRepository extends JpaRepository<InviteLink, Long> {

    @EntityGraph(attributePaths = {"room", "createdBy"})
    @Query("SELECT il FROM InviteLink il WHERE il.token = :token")
    Optional<InviteLink> findByToken(@Param("token") String token);

    @EntityGraph(attributePaths = {"room", "createdBy"})
    @Query("SELECT il FROM InviteLink il WHERE il.room.id = :roomId ORDER BY il.createdAt DESC")
    List<InviteLink> findAllByRoomId(@Param("roomId") Long roomId);

    @Modifying
    @Query("UPDATE InviteLink il SET il.status = :status WHERE il.id = :id")
    int updateStatusById(@Param("id") Long id, @Param("status") InviteStatus status);

    @Modifying
    @Query("UPDATE InviteLink il SET il.useCount = il.useCount + 1 WHERE il.id = :id")
    int incrementUseCount(@Param("id") Long id);

    @Modifying
    @Query("""
            UPDATE InviteLink il
            SET il.status = 'EXPIRED'
            WHERE il.status = 'ACTIVE'
            AND il.expiresAt < :now
            """)
    int expireAllPastDue(@Param("now") Instant now);
}
