package com.skillsync.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "reviews")
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewer_id", nullable = false)
    private User reviewer;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "reviewee_id", nullable = false)
    private User reviewee;

    @Column(nullable = false)
    private Integer rating;   // 1-5 stars

    @Column(columnDefinition = "TEXT")
    private String comment;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Review() {}

    public Review(Long id, User reviewer, User reviewee, Integer rating, String comment, LocalDateTime createdAt) {
        this.id = id;
        this.reviewer = reviewer;
        this.reviewee = reviewee;
        this.rating = rating;
        this.comment = comment;
        this.createdAt = createdAt;
    }

    public static ReviewBuilder builder() {
        return new ReviewBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getReviewer() { return reviewer; }
    public void setReviewer(User reviewer) { this.reviewer = reviewer; }
    public User getReviewee() { return reviewee; }
    public void setReviewee(User reviewee) { this.reviewee = reviewee; }
    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }
    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public static class ReviewBuilder {
        private Long id;
        private User reviewer;
        private User reviewee;
        private Integer rating;
        private String comment;
        private LocalDateTime createdAt;

        public ReviewBuilder id(Long id) { this.id = id; return this; }
        public ReviewBuilder reviewer(User reviewer) { this.reviewer = reviewer; return this; }
        public ReviewBuilder reviewee(User reviewee) { this.reviewee = reviewee; return this; }
        public ReviewBuilder rating(Integer rating) { this.rating = rating; return this; }
        public ReviewBuilder comment(String comment) { this.comment = comment; return this; }
        public ReviewBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Review build() {
            return new Review(id, reviewer, reviewee, rating, comment, createdAt);
        }
    }
}
