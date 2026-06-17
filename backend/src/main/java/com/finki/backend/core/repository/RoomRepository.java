package com.finki.backend.core.repository;

import com.finki.backend.core.domain.Room;
import com.finki.backend.core.domain.enums.RoomStatus;
import org.springframework.data.jpa.repository.EntityGraph;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface RoomRepository extends JpaRepository<Room, Long> {

    @EntityGraph(attributePaths = {"createdBy"})
    @Query("SELECT r FROM Room r WHERE r.id = :id")
    Optional<Room> findByIdWithCreator(@Param("id") Long id);

    @EntityGraph(attributePaths = {"createdBy"})
    @Query("SELECT r FROM Room r WHERE r.createdBy.id = :userId AND r.status = :status ORDER BY r.createdAt DESC")
    List<Room> findAllByCreatorAndStatus(@Param("userId") Long userId, @Param("status") RoomStatus status);

    @EntityGraph(attributePaths = {"createdBy"})
    @Query("SELECT r FROM Room r WHERE r.status = :status ORDER BY r.createdAt DESC")
    List<Room> findAllByStatus(@Param("status") RoomStatus status);

    @Modifying
    @Query("UPDATE Room r SET r.status = :status WHERE r.id = :id")
    int updateStatusById(@Param("id") Long id, @Param("status") RoomStatus status);

    @Query("SELECT COUNT(r) > 0 FROM Room r WHERE r.id = :roomId AND r.createdBy.id = :userId")
    boolean existsByIdAndCreatorId(@Param("roomId") Long roomId, @Param("userId") Long userId);
}
