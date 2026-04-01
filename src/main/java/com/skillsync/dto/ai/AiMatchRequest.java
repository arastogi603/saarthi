package com.skillsync.dto.ai;

import java.util.List;

public class AiMatchRequest {
    private Long userId;
    private List<AiUserDto> users;

    public AiMatchRequest() {
    }

    public AiMatchRequest(Long userId, List<AiUserDto> users) {
        this.userId = userId;
        this.users = users;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public List<AiUserDto> getUsers() {
        return users;
    }

    public void setUsers(List<AiUserDto> users) {
        this.users = users;
    }

    public static AiMatchRequestBuilder builder() {
        return new AiMatchRequestBuilder();
    }

    public static class AiMatchRequestBuilder {
        private Long userId;
        private List<AiUserDto> users;

        public AiMatchRequestBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public AiMatchRequestBuilder users(List<AiUserDto> users) {
            this.users = users;
            return this;
        }

        public AiMatchRequest build() {
            return new AiMatchRequest(userId, users);
        }
    }
}
