package com.skillsync.dto.ai;

import java.util.List;

public class AiRecommendRequest {
    private Long userId;
    private List<AiUserDto> users;

    public AiRecommendRequest() {
    }

    public AiRecommendRequest(Long userId, List<AiUserDto> users) {
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

    public static AiRecommendRequestBuilder builder() {
        return new AiRecommendRequestBuilder();
    }

    public static class AiRecommendRequestBuilder {
        private Long userId;
        private List<AiUserDto> users;

        public AiRecommendRequestBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public AiRecommendRequestBuilder users(List<AiUserDto> users) {
            this.users = users;
            return this;
        }

        public AiRecommendRequest build() {
            return new AiRecommendRequest(userId, users);
        }
    }
}
