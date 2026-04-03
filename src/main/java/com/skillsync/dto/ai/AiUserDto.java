package com.skillsync.dto.ai;

import java.util.ArrayList;
import java.util.List;

public class AiUserDto {
    private Long userId;
    private String name = "Unknown";
    private List<String> skills = new ArrayList<>();
    private String level = "Beginner";
    private String goal = "General";
    private String studyMode = "Learn";
    private String bio = "";
    private List<String> interests = new ArrayList<>();
    private AiUserActivityDto activity = new AiUserActivityDto();
    private List<Double> ratings = new ArrayList<>();
    private int joinedDaysAgo = 0;

    public AiUserDto() {}

    public AiUserDto(Long userId, String name, List<String> skills, String level, String goal, String studyMode, String bio, List<String> interests, AiUserActivityDto activity, List<Double> ratings, int joinedDaysAgo) {
        this.userId = userId;
        this.name = name;
        this.skills = skills;
        this.level = level;
        this.goal = goal;
        this.studyMode = studyMode;
        this.bio = bio;
        this.interests = interests;
        this.activity = activity;
        this.ratings = ratings;
        this.joinedDaysAgo = joinedDaysAgo;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private Long userId;
        private String name = "Unknown";
        private List<String> skills = new ArrayList<>();
        private String level = "Beginner";
        private String goal = "General";
        private String studyMode = "Learn";
        private String bio = "";
        private List<String> interests = new ArrayList<>();
        private AiUserActivityDto activity = new AiUserActivityDto();
        private List<Double> ratings = new ArrayList<>();
        private int joinedDaysAgo = 0;

        public Builder userId(Long userId) { this.userId = userId; return this; }
        public Builder name(String name) { this.name = name; return this; }
        public Builder skills(List<String> skills) { this.skills = skills; return this; }
        public Builder level(String level) { this.level = level; return this; }
        public Builder goal(String goal) { this.goal = goal; return this; }
        public Builder studyMode(String studyMode) { this.studyMode = studyMode; return this; }
        public Builder bio(String bio) { this.bio = bio; return this; }
        public Builder interests(List<String> interests) { this.interests = interests; return this; }
        public Builder activity(AiUserActivityDto activity) { this.activity = activity; return this; }
        public Builder ratings(List<Double> ratings) { this.ratings = ratings; return this; }
        public Builder joinedDaysAgo(int joinedDaysAgo) { this.joinedDaysAgo = joinedDaysAgo; return this; }

        public AiUserDto build() {
            return new AiUserDto(userId, name, skills, level, goal, studyMode, bio, interests, activity, ratings, joinedDaysAgo);
        }
    }

    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public String getStudyMode() { return studyMode; }
    public void setStudyMode(String studyMode) { this.studyMode = studyMode; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public List<String> getInterests() { return interests; }
    public void setInterests(List<String> interests) { this.interests = interests; }
    public AiUserActivityDto getActivity() { return activity; }
    public void setActivity(AiUserActivityDto activity) { this.activity = activity; }
    public List<Double> getRatings() { return ratings; }
    public void setRatings(List<Double> ratings) { this.ratings = ratings; }
    public int getJoinedDaysAgo() { return joinedDaysAgo; }
    public void setJoinedDaysAgo(int joinedDaysAgo) { this.joinedDaysAgo = joinedDaysAgo; }
}
