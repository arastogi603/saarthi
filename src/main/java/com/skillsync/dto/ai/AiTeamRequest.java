package com.skillsync.dto.ai;

import java.util.List;

public class AiTeamRequest {
    private Long userId;
    private Integer teamSize;
    private List<AiUserDto> users;

    public AiTeamRequest() {
    }

    public AiTeamRequest(Long userId, Integer teamSize, List<AiUserDto> users) {
        this.userId = userId;
        this.teamSize = teamSize;
        this.users = users;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getTeamSize() {
        return teamSize;
    }

    public void setTeamSize(Integer teamSize) {
        this.teamSize = teamSize;
    }

    public List<AiUserDto> getUsers() {
        return users;
    }

    public void setUsers(List<AiUserDto> users) {
        this.users = users;
    }

    public static AiTeamRequestBuilder builder() {
        return new AiTeamRequestBuilder();
    }

    public static class AiTeamRequestBuilder {
        private Long userId;
        private Integer teamSize;
        private List<AiUserDto> users;

        public AiTeamRequestBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public AiTeamRequestBuilder teamSize(Integer teamSize) {
            this.teamSize = teamSize;
            return this;
        }

        public AiTeamRequestBuilder users(List<AiUserDto> users) {
            this.users = users;
            return this;
        }

        public AiTeamRequest build() {
            return new AiTeamRequest(userId, teamSize, users);
        }
    }
}
