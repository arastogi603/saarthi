package com.skillsync.dto.ai;

import java.util.List;

public class AiSuggestProjectsRequest {
    private List<String> skills;

    public AiSuggestProjectsRequest() {
    }

    public AiSuggestProjectsRequest(List<String> skills) {
        this.skills = skills;
    }

    public List<String> getSkills() {
        return skills;
    }

    public void setSkills(List<String> skills) {
        this.skills = skills;
    }

    public static AiSuggestProjectsRequestBuilder builder() {
        return new AiSuggestProjectsRequestBuilder();
    }

    public static class AiSuggestProjectsRequestBuilder {
        private List<String> skills;

        public AiSuggestProjectsRequestBuilder skills(List<String> skills) {
            this.skills = skills;
            return this;
        }

        public AiSuggestProjectsRequest build() {
            return new AiSuggestProjectsRequest(skills);
        }
    }
}
