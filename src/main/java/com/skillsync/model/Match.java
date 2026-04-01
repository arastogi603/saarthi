package com.skillsync.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;

@Entity
@Table(name = "matches")
public class Match {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user1_id", nullable = false)
    private User user1;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "user2_id", nullable = false)
    private User user2;

    @Column(nullable = false)
    private Double score;   // 0.0 to 100.0 match percentage

    @Enumerated(EnumType.STRING)
    private MatchStatus status = MatchStatus.PENDING;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Match() {}

    public Match(Long id, User user1, User user2, Double score, MatchStatus status) {
        this.id = id;
        this.user1 = user1;
        this.user2 = user2;
        this.score = score;
        this.status = status;
    }

    public enum MatchStatus {
        PENDING, ACCEPTED, REJECTED
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser1() { return user1; }
    public void setUser1(User user1) { this.user1 = user1; }
    public User getUser2() { return user2; }
    public void setUser2(User user2) { this.user2 = user2; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public MatchStatus getStatus() { return status; }
    public void setStatus(MatchStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }

    // Builder
    public static MatchBuilder builder() {
        return new MatchBuilder();
    }

    public static class MatchBuilder {
        private Long id;
        private User user1;
        private User user2;
        private Double score;
        private MatchStatus status = MatchStatus.PENDING;

        public MatchBuilder id(Long id) { this.id = id; return this; }
        public MatchBuilder user1(User user1) { this.user1 = user1; return this; }
        public MatchBuilder user2(User user2) { this.user2 = user2; return this; }
        public MatchBuilder score(Double score) { this.score = score; return this; }
        public MatchBuilder status(MatchStatus status) { this.status = status; return this; }

        public Match build() {
            return new Match(id, user1, user2, score, status);
        }
    }
}
