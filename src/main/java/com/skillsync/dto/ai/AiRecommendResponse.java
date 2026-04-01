package com.skillsync.dto.ai;

import java.util.List;

public class AiRecommendResponse {
    private Long userId;
    private Integer page;
    private Integer limit;
    private List<PersonRecommendation> people;
    private List<ProjectSuggestion> projects;

    public AiRecommendResponse() {
    }

    public AiRecommendResponse(Long userId, Integer page, Integer limit, List<PersonRecommendation> people, List<ProjectSuggestion> projects) {
        this.userId = userId;
        this.page = page;
        this.limit = limit;
        this.people = people;
        this.projects = projects;
    }

    public Long getUserId() {
        return userId;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public Integer getPage() {
        return page;
    }

    public void setPage(Integer page) {
        this.page = page;
    }

    public Integer getLimit() {
        return limit;
    }

    public void setLimit(Integer limit) {
        this.limit = limit;
    }

    public List<PersonRecommendation> getPeople() {
        return people;
    }

    public void setPeople(List<PersonRecommendation> people) {
        this.people = people;
    }

    public List<ProjectSuggestion> getProjects() {
        return projects;
    }

    public void setProjects(List<ProjectSuggestion> projects) {
        this.projects = projects;
    }

    public static AiRecommendResponseBuilder builder() {
        return new AiRecommendResponseBuilder();
    }

    public static class AiRecommendResponseBuilder {
        private Long userId;
        private Integer page;
        private Integer limit;
        private List<PersonRecommendation> people;
        private List<ProjectSuggestion> projects;

        public AiRecommendResponseBuilder userId(Long userId) {
            this.userId = userId;
            return this;
        }

        public AiRecommendResponseBuilder page(Integer page) {
            this.page = page;
            return this;
        }

        public AiRecommendResponseBuilder limit(Integer limit) {
            this.limit = limit;
            return this;
        }

        public AiRecommendResponseBuilder people(List<PersonRecommendation> people) {
            this.people = people;
            return this;
        }

        public AiRecommendResponseBuilder projects(List<ProjectSuggestion> projects) {
            this.projects = projects;
            return this;
        }

        public AiRecommendResponse build() {
            return new AiRecommendResponse(userId, page, limit, people, projects);
        }
    }

    public static class PersonRecommendation {
        private Long userId;
        private String name;
        private List<String> skills;
        private String level;
        private String goal;
        private Double matchScore;
        private Boolean trending;

        public PersonRecommendation() {
        }

        public PersonRecommendation(Long userId, String name, List<String> skills, String level, String goal, Double matchScore, Boolean trending) {
            this.userId = userId;
            this.name = name;
            this.skills = skills;
            this.level = level;
            this.goal = goal;
            this.matchScore = matchScore;
            this.trending = trending;
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

        public Boolean getTrending() {
            return trending;
        }

        public void setTrending(Boolean trending) {
            this.trending = trending;
        }
    }

    public static class ProjectSuggestion {
        private String title;
        private String description;
        private List<String> requiredSkills;
        private String difficulty;
        private String category;
        private Double matchScore;
        private String source;

        public ProjectSuggestion() {
        }

        public ProjectSuggestion(String title, String description, List<String> requiredSkills, String difficulty, String category, Double matchScore, String source) {
            this.title = title;
            this.description = description;
            this.requiredSkills = requiredSkills;
            this.difficulty = difficulty;
            this.category = category;
            this.matchScore = matchScore;
            this.source = source;
        }

        public String getTitle() {
            return title;
        }

        public void setTitle(String title) {
            this.title = title;
        }

        public String getDescription() {
            return description;
        }

        public void setDescription(String description) {
            this.description = description;
        }

        public List<String> getRequiredSkills() {
            return requiredSkills;
        }

        public void setRequiredSkills(List<String> requiredSkills) {
            this.requiredSkills = requiredSkills;
        }

        public String getDifficulty() {
            return difficulty;
        }

        public void setDifficulty(String difficulty) {
            this.difficulty = difficulty;
        }

        public String getCategory() {
            return category;
        }

        public void setCategory(String category) {
            this.category = category;
        }

        public Double getMatchScore() {
            return matchScore;
        }

        public void setMatchScore(Double matchScore) {
            this.matchScore = matchScore;
        }

        public String getSource() {
            return source;
        }

        public void setSource(String source) {
            this.source = source;
        }
    }
}
