package com.skillsync.dto.ai;

import java.util.List;

public class AiMatchResult {
    private Long userId;
    private String name;
    private List<String> skills;
    private String level;
    private String goal;
    private Double matchScore;

    public AiMatchResult() {
    }

    public AiMatchResult(Long userId, String name, List<String> skills, String level, String goal, Double matchScore) {
        this.userId = userId;
        this.name = name;
        this.skills = skills;
        this.level = level;
        this.goal = goal;
        this.matchScore = matchScore;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public String getLevel() {
        return level;
    }

    public void setLevel(String level) {
        this.level = level;
    }

    public String getGoal() {
        return goal;
    }

    public void setGoal(String goal) {
        this.goal = goal;
    }

    public Double getMatchScore() {
        return matchScore;
    }

    public void setMatchScore(Double matchScore) {
        this.matchScore = matchScore;
    }

    public static AiMatchResultBuilder builder() {
        return new AiMatchResultBuilder();
    }

    public static class AiMatchResultBuilder {
        private Long userId;
        private String name;
        private List<String> skills;
        private String level;
        private String goal;
        private Double matchScore;

        public AiMatchResultBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public AiMatchResultBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AiMatchResultBuilder skills(List<String> skills) {
            this.skills = skills;
            return this;
        }

        public AiMatchResultBuilder level(String level) {
            this.level = level;
            return this;
        }

        public AiMatchResultBuilder goal(String goal) {
            this.goal = goal;
            return this;
        }

        public AiMatchResultBuilder matchScore(Double matchScore) {
            this.matchScore = matchScore;
            return this;
        }

        public AiMatchResult build() {
            return new AiMatchResult(userId, name, skills, level, goal, matchScore);
        }
    }
}
