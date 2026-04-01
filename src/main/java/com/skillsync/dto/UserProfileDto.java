package com.skillsync.dto;

import java.util.List;

public class UserProfileDto {
    private Long id;
    private String name;
    private String email;
    private String bio;
    private String avatarUrl;
    private String goal;
    private Double trustScore;
    private List<SkillDto> skills;

    public UserProfileDto() {}

    public UserProfileDto(Long id, String name, String email, String bio, String avatarUrl, String goal, Double trustScore, List<SkillDto> skills) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.goal = goal;
        this.trustScore = trustScore;
        this.skills = skills;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long id;
        private String name;
        private String email;
        private String bio;
        private String avatarUrl;
        private String goal;
        private Double trustScore;
        private List<SkillDto> skills;

        public Builder id(Long id) { this.id = id; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder email(String email) { this.email = email; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public Builder goal(String goal) { this.goal = goal; return this; }
        public Builder trustScore(Double trustScore) { this.trustScore = trustScore; return this; }
        public Builder skills(List<SkillDto> skills) { this.skills = skills; return this; }

        public UserProfileDto build() {
            return new UserProfileDto(id, name, email, bio, avatarUrl, goal, trustScore, skills);
        }
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public Double getTrustScore() { return trustScore; }
    public void setTrustScore(Double trustScore) { this.trustScore = trustScore; }
    public List<SkillDto> getSkills() { return skills; }
    public void setSkills(List<SkillDto> skills) { this.skills = skills; }

    public static class SkillDto {
        private String skillName;
        private String level;
        private String category;

        public SkillDto() {}

        public SkillDto(String skillName, String level, String category) {
            this.skillName = skillName;
            this.level = level;
            this.category = category;
        }

        public static Builder builder() {
            return new Builder();
        }

        public static class Builder {
            private String skillName;
            private String level;
            private String category;

            public Builder skillName(String skillName) { this.skillName = skillName; return this; }
            public Builder level(String level) { this.level = level; return this; }
            public Builder category(String category) { this.category = category; return this; }

            public SkillDto build() {
                return new SkillDto(skillName, level, category);
            }
        }

        // Getters and Setters
        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }
}
