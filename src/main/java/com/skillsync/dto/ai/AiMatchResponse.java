package com.skillsync.dto.ai;

import java.util.List;

public class AiMatchResponse {
    private Long userId;
    private List<MatchResult> matches;
    private Integer total;

    public AiMatchResponse() {
    }

    public AiMatchResponse(Long userId, List<MatchResult> matches, Integer total) {
        this.userId = userId;
        this.matches = matches;
        this.total = total;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<MatchResult> getMatches() {
        return matches;
    }

    public void setMatches(List<MatchResult> matches) {
        this.matches = matches;
    }

    public Integer getTotal() {
        return total;
    }

    public void setTotal(Integer total) {
        this.total = total;
    }

    public static AiMatchResponseBuilder builder() {
        return new AiMatchResponseBuilder();
    }

    public static class AiMatchResponseBuilder {
        private Long userId;
        private List<MatchResult> matches;
        private Integer total;

        public AiMatchResponseBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public AiMatchResponseBuilder matches(List<MatchResult> matches) {
            this.matches = matches;
            return this;
        }

        public AiMatchResponseBuilder total(Integer total) {
            this.total = total;
            return this;
        }

        public AiMatchResponse build() {
            return new AiMatchResponse(userId, matches, total);
        }
    }

    public static class MatchResult {
        private Long userId;
        private String name;
        private List<String> skills;
        private String level;
        private String goal;
        private Double matchScore;

        public MatchResult() {
        }

        public MatchResult(Long userId, String name, List<String> skills, String level, String goal, Double matchScore) {
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
    }
}
