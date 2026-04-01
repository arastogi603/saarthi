package com.skillsync.dto.ai;

import java.util.List;

public class AiTeamResponse {
    private Long seedUserId;
    private List<TeamMember> team;
    private Integer teamSize;

    public AiTeamResponse() {
    }

    public AiTeamResponse(Long seedUserId, List<TeamMember> team, Integer teamSize) {
        this.seedUserId = seedUserId;
        this.team = team;
        this.teamSize = teamSize;
    }

    public Long getSeedUserId() {
        return seedUserId;
    }

    public void setSeedUserId(Long seedUserId) {
        this.seedUserId = seedUserId;
    }

    public List<TeamMember> getTeam() {
        return team;
    }

    public void setTeam(List<TeamMember> team) {
        this.team = team;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }

    public static AiTeamResponseBuilder builder() {
        return new AiTeamResponseBuilder();
    }

    public static class AiTeamResponseBuilder {
        private Long seedUserId;
        private List<TeamMember> team;
        private Integer teamSize;

        public AiTeamResponseBuilder seedUserId(Long seedUserId) {
            this.seedUserId = seedUserId;
            return this;
        }

        public AiTeamResponseBuilder team(List<TeamMember> team) {
            this.team = team;
            return this;
        }

        public AiTeamResponseBuilder teamSize(Integer teamSize) {
            this.teamSize = teamSize;
            return this;
        }

        public AiTeamResponse build() {
            return new AiTeamResponse(seedUserId, team, teamSize);
        }
    }

    public static class TeamMember {
        private Long userId;
        private String name;
        private List<String> skills;
        private String level;
        private String role;

        public TeamMember() {
        }

        public TeamMember(Long userId, String name, List<String> skills, String level, String role) {
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
    }
}
