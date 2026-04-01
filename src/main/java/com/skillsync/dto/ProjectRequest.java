package com.skillsync.dto;

import jakarta.validation.constraints.NotBlank;
import java.util.List;

public class ProjectRequest {

    @NotBlank(message = "Title is required")
    private String title;

    private String description;

    private List<String> requiredSkills;

    // Optional: OPEN / IN_PROGRESS / CLOSED
    private String status;

    public ProjectRequest() {}

    public ProjectRequest(String title, String description, List<String> requiredSkills, String status) {
        this.title = title;
        this.description = description;
        this.requiredSkills = requiredSkills;
        this.status = status;
    }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
