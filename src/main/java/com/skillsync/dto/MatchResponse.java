package com.skillsync.dto;

import java.util.List;

public class MatchResponse {
    private Long matchId; // Primary identifier for the match record
    private UserProfileDto matchedUser;
    private Double score;           // 0.0 – 100.0
    private String status;          // PENDING / ACCEPTED / REJECTED
    private List<String> commonSkills;
    private String createdAt;
    private Long senderId; // The user ID of the person who initiated the request
    private Long projectId;
    private String fulfilledSkill;
    private List<String> projectSkills;

    public MatchResponse() {}

    public MatchResponse(Long matchId, UserProfileDto matchedUser, Double score, String status, List<String> commonSkills, String createdAt, Long senderId, Long projectId, String fulfilledSkill, List<String> projectSkills) {
        this.matchId = matchId;
        this.matchedUser = matchedUser;
        this.score = score;
        this.status = status;
        this.commonSkills = commonSkills;
        this.createdAt = createdAt;
        this.senderId = senderId;
        this.projectId = projectId;
        this.fulfilledSkill = fulfilledSkill;
        this.projectSkills = projectSkills;
    }

    // Getters and Setters
    public Long getMatchId() { return matchId; }
    public void setMatchId(Long matchId) { this.matchId = matchId; }
    public UserProfileDto getMatchedUser() { return matchedUser; }
    public void setMatchedUser(UserProfileDto matchedUser) { this.matchedUser = matchedUser; }
    public Double getScore() { return score; }
    public void setScore(Double score) { this.score = score; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public List<String> getCommonSkills() { return commonSkills; }
    public void setCommonSkills(List<String> commonSkills) { this.commonSkills = commonSkills; }
    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public Long getProjectId() { return projectId; }
    public void setProjectId(Long projectId) { this.projectId = projectId; }
    public String getFulfilledSkill() { return fulfilledSkill; }
    public void setFulfilledSkill(String fulfilledSkill) { this.fulfilledSkill = fulfilledSkill; }
    public List<String> getProjectSkills() { return projectSkills; }
    public void setProjectSkills(List<String> projectSkills) { this.projectSkills = projectSkills; }

    // Builder
    public static MatchResponseBuilder builder() {
        return new MatchResponseBuilder();
    }

    public static class MatchResponseBuilder {
        private Long matchId;
        private UserProfileDto matchedUser;
        private Double score;
        private String status;
        private List<String> commonSkills;
        private String createdAt;
        private Long senderId;
        private Long projectId;
        private String fulfilledSkill;
        private List<String> projectSkills;

        public MatchResponseBuilder matchId(Long matchId) { this.matchId = matchId; return this; }
        public MatchResponseBuilder matchedUser(UserProfileDto matchedUser) { this.matchedUser = matchedUser; return this; }
        public MatchResponseBuilder score(Double score) { this.score = score; return this; }
        public MatchResponseBuilder status(String status) { this.status = status; return this; }
        public MatchResponseBuilder commonSkills(List<String> commonSkills) { this.commonSkills = commonSkills; return this; }
        public MatchResponseBuilder createdAt(String createdAt) { this.createdAt = createdAt; return this; }
        public MatchResponseBuilder senderId(Long senderId) { this.senderId = senderId; return this; }
        public MatchResponseBuilder projectId(Long projectId) { this.projectId = projectId; return this; }
        public MatchResponseBuilder fulfilledSkill(String fulfilledSkill) { this.fulfilledSkill = fulfilledSkill; return this; }

        public MatchResponseBuilder projectSkills(List<String> projectSkills) { this.projectSkills = projectSkills; return this; }

        public MatchResponse build() {
            return new MatchResponse(matchId, matchedUser, score, status, commonSkills, createdAt, senderId, projectId, fulfilledSkill, projectSkills);
        }
    }
}
