package com.skillsync.repository;

import com.skillsync.model.Review;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;
import java.util.Optional;

public interface ReviewRepository extends JpaRepository<Review, Long> {
    List<Review> findByRevieweeId(Long revieweeId);
    boolean existsByReviewerIdAndRevieweeId(Long reviewerId, Long revieweeId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.reviewee.id = :userId")
    Optional<Double> calculateAverageRating(@Param("userId") Long userId);
}
