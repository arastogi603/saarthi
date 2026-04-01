package com.skillsync.service;

import com.skillsync.dto.ReviewRequest;
import com.skillsync.model.Review;
import com.skillsync.model.User;
import com.skillsync.repository.ReviewRepository;
import com.skillsync.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ReviewService {

    private final ReviewRepository reviewRepository;
    private final UserRepository userRepository;

    public ReviewService(ReviewRepository reviewRepository, UserRepository userRepository) {
        this.reviewRepository = reviewRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public Review addReview(ReviewRequest request, String reviewerEmail) {
        User reviewer = userRepository.findByEmail(reviewerEmail)
                .orElseThrow(() -> new RuntimeException("Reviewer not found"));

        User reviewee = userRepository.findById(request.getRevieweeId())
                .orElseThrow(() -> new RuntimeException("Reviewee not found"));

        if (reviewer.getId().equals(reviewee.getId())) {
            throw new RuntimeException("Cannot review yourself");
        }
        if (reviewRepository.existsByReviewerIdAndRevieweeId(reviewer.getId(), reviewee.getId())) {
            throw new RuntimeException("You have already reviewed this user");
        }

        Review review = Review.builder()
                .reviewer(reviewer)
                .reviewee(reviewee)
                .rating(request.getRating())
                .comment(request.getComment())
                .build();
        review = reviewRepository.save(review);

        // Recalculate and update trust score
        updateTrustScore(reviewee);

        return review;
    }

    public List<Review> getReviewsForUser(Long userId) {
        return reviewRepository.findByRevieweeId(userId);
    }

    public Double getTrustScore(Long userId) {
        return reviewRepository.calculateAverageRating(userId).orElse(0.0);
    }

    private void updateTrustScore(User user) {
        double avg = reviewRepository.calculateAverageRating(user.getId()).orElse(0.0);
        // Scale to 0–100
        user.setTrustScore(avg * 20.0);
        userRepository.save(user);
    }
}
