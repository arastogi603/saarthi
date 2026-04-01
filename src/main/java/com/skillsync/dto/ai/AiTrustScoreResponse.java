package com.skillsync.dto.ai;

public class AiTrustScoreResponse {
    private Long userId;
    private Integer trustScore;
    private Double activityComponent;
    private Double ratingComponent;
    private String label;

    public AiTrustScoreResponse() {}

    public AiTrustScoreResponse(Long userId, Integer trustScore, Double activityComponent, Double ratingComponent, String label) {
        this.userId = userId;
        this.trustScore = trustScore;
        this.activityComponent = activityComponent;
        this.ratingComponent = ratingComponent;
        this.label = label;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long userId;
        private Integer trustScore;
        private Double activityComponent;
        private Double ratingComponent;
        private String label;

        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder trustScore(Integer trustScore) { this.trustScore = trustScore; return this; }
        public Builder activityComponent(Double activityComponent) { this.activityComponent = activityComponent; return this; }
        public Builder ratingComponent(Double ratingComponent) { this.ratingComponent = ratingComponent; return this; }
        public Builder label(String label) { this.label = label; return this; }

        public AiTrustScoreResponse build() {
            return new AiTrustScoreResponse(userId, trustScore, activityComponent, ratingComponent, label);
        }
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public Integer getTrustScore() { return trustScore; }
    public void setTrustScore(Integer trustScore) { this.trustScore = trustScore; }
    public Double getActivityComponent() { return activityComponent; }
    public void setActivityComponent(Double activityComponent) { this.activityComponent = activityComponent; }
    public Double getRatingComponent() { return ratingComponent; }
    public void setRatingComponent(Double ratingComponent) { this.ratingComponent = ratingComponent; }
    public String getLabel() { return label; }
    public void setLabel(String label) { this.label = label; }
}

