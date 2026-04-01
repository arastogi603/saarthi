package com.skillsync.controller;

import com.skillsync.dto.ReviewRequest;
import com.skillsync.model.Review;
import com.skillsync.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/reviews")
@CrossOrigin(origins = "*")
public class ReviewController {

    private final ReviewService reviewService;

    public ReviewController(ReviewService reviewService) {
        this.reviewService = reviewService;
    }

    // POST /api/reviews
    @PostMapping
    public ResponseEntity<?> postReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            Review review = reviewService.addReview(request, userDetails.getUsername());
            return ResponseEntity.ok(review);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // GET /api/reviews/user/{id}
    @GetMapping("/user/{id}")
    public ResponseEntity<List<Review>> getReviewsForUser(@PathVariable Long id) {
        return ResponseEntity.ok(reviewService.getReviewsForUser(id));
    }

    // GET /api/reviews/user/{id}/trust-score
    @GetMapping("/user/{id}/trust-score")
    public ResponseEntity<Map<String, Object>> getTrustScore(@PathVariable Long id) {
        Double score = reviewService.getTrustScore(id);
        return ResponseEntity.ok(Map.of(
                "userId", id,
                "trustScore", Math.round(score * 20.0 * 10.0) / 10.0,
                "averageRating", Math.round(score * 10.0) / 10.0
        ));
    }
}
