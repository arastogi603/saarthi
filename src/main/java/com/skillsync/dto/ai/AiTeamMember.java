package com.skillsync.dto.ai;

import java.util.List;

public class AiTeamMember {
    private Long userId;
    private String name;
    private List<String> skills;
    private String level;
    private String role;

    public AiTeamMember() {
    }

    public AiTeamMember(Long userId, String name, List<String> skills, String level, String role) {
        this.userId = userId;
        this.name = name;
        this.skills = skills;
        this.level = level;
        this.role = role;
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

    public String getRole() {
        return role;
    }

    public void setRole(String role) {
        this.role = role;
    }

    public static AiTeamMemberBuilder builder() {
        return new AiTeamMemberBuilder();
    }

    public static class AiTeamMemberBuilder {
        private Long userId;
        private String name;
        private List<String> skills;
        private String level;
        private String role;

        public AiTeamMemberBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public AiTeamMemberBuilder name(String name) {
            this.name = name;
            return this;
        }

        public AiTeamMemberBuilder skills(List<String> skills) {
            this.skills = skills;
            return this;
        }

        public AiTeamMemberBuilder level(String level) {
            this.level = level;
            return this;
        }

        public AiTeamMemberBuilder role(String role) {
            this.role = role;
            return this;
        }

        public AiTeamMember build() {
            return new AiTeamMember(userId, name, skills, level, role);
        }
    }
}
