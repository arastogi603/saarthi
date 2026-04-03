package com.skillsync.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import jakarta.validation.constraints.NotEmpty;
import java.util.List;

public class UpdateProfileRequest {
    private String name;
    private String bio;
    private String goal;
    private String studyMode;
    private List<SkillRequest> skills;

    public UpdateProfileRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
    public List<SkillRequest> getSkills() { return skills; }
    public void setSkills(List<SkillRequest> skills) { this.skills = skills; }

    public String getStudyMode() { return studyMode; }
    public void setStudyMode(String studyMode) { this.studyMode = studyMode; }

    public static class SkillRequest {
        @NotEmpty
        private String skillName;
        private String level;      // BEGINNER / INTERMEDIATE / EXPERT
        private String category;   // Frontend / Backend / AI / etc.

        public SkillRequest() {}

        @JsonCreator
        public SkillRequest(String skillName) {
            this.skillName = skillName;
        }

        public SkillRequest(String skillName, String level, String category) {
            this.skillName = skillName;
            this.level = level;
            this.category = category;
        }

        public String getSkillName() { return skillName; }
        public void setSkillName(String skillName) { this.skillName = skillName; }
        public String getLevel() { return level; }
        public void setLevel(String level) { this.level = level; }
        public String getCategory() { return category; }
        public void setCategory(String category) { this.category = category; }
    }
}
