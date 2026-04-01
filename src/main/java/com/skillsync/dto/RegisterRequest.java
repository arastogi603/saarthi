package com.skillsync.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;
import java.util.List;

public class RegisterRequest {

    private String name;

    @Email(message = "Valid email is required")
    @NotBlank(message = "Email is required")
    private String email;

    @NotBlank(message = "Password is required")
    @Size(min = 6, message = "Password must be at least 6 characters")
    private String password;

    private String bio;

    // e.g., ["React", "Java", "ML"]
    private List<String> skills;

    // Skill level for ALL skills: BEGINNER / INTERMEDIATE / EXPERT
    private String skillLevel;

    // Goal: PROJECT_PARTNER / STUDY_BUDDY / DISCUSSION_GROUP / TEAM_MEMBER / PLACEMENT_PREP
    private String goal;

    public RegisterRequest() {}

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public List<String> getSkills() { return skills; }
    public void setSkills(List<String> skills) { this.skills = skills; }
    public String getSkillLevel() { return skillLevel; }
    public void setSkillLevel(String skillLevel) { this.skillLevel = skillLevel; }
    public String getGoal() { return goal; }
    public void setGoal(String goal) { this.goal = goal; }
}
