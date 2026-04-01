package com.skillsync.dto.ai;

import java.util.List;

public class AiTrustScoreRequest {
    private Long userId;
    private List<AiUserDto> users;

    public AiTrustScoreRequest() {}

    public AiTrustScoreRequest(Long userId, List<AiUserDto> users) {
        this.userId = userId;
        this.users = users;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long userId;
        private List<AiUserDto> users;

        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder users(List<AiUserDto> users) { this.users = users; return this; }

        public AiTrustScoreRequest build() {
            return new AiTrustScoreRequest(userId, users);
        }
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public List<AiUserDto> getUsers() { return users; }
    public void setUsers(List<AiUserDto> users) { this.users = users; }
}
