package com.skillsync.repository;

import com.skillsync.model.Match;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface MatchRepository extends JpaRepository<Match, Long> {

    @Query("SELECT m FROM Match m WHERE m.user1.id = :userId OR m.user2.id = :userId ORDER BY m.score DESC")
    List<Match> findMatchesForUser(@Param("userId") Long userId);

    @Query("SELECT m FROM Match m WHERE (m.user1.id = :u1 AND m.user2.id = :u2) OR (m.user1.id = :u2 AND m.user2.id = :u1)")
    Optional<Match> findByUsers(@Param("u1") Long user1Id, @Param("u2") Long user2Id);

    @Query("SELECT m FROM Match m WHERE m.user2.id = :userId AND m.status = 'PENDING' ORDER BY m.score DESC")
    List<Match> findPendingByRecipient(@Param("userId") Long userId);
}
