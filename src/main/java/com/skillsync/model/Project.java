package com.skillsync.model;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "projects")
public class Project {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(columnDefinition = "TEXT")
    private String description;

    @ElementCollection
    @CollectionTable(name = "project_required_skills", joinColumns = @JoinColumn(name = "project_id"))
    @Column(name = "skill")
    private List<String> requiredSkills = new ArrayList<>();

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "posted_by", nullable = false)
    @JsonIgnoreProperties({"password", "userSkills", "hibernateLazyInitializer", "handler"})
    private User postedBy;

    @Enumerated(EnumType.STRING)
    private ProjectStatus status = ProjectStatus.OPEN;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public Project() {}

    public Project(Long id, String title, String description, List<String> requiredSkills, User postedBy, ProjectStatus status, LocalDateTime createdAt) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.requiredSkills = requiredSkills != null ? requiredSkills : new ArrayList<>();
        this.postedBy = postedBy;
        this.status = status != null ? status : ProjectStatus.OPEN;
        this.createdAt = createdAt;
    }

    public static ProjectBuilder builder() {
        return new ProjectBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }
    public List<String> getRequiredSkills() { return requiredSkills; }
    public void setRequiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; }
    public User getPostedBy() { return postedBy; }
    public void setPostedBy(User postedBy) { this.postedBy = postedBy; }
    public ProjectStatus getStatus() { return status; }
    public void setStatus(ProjectStatus status) { this.status = status; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum ProjectStatus {
        OPEN, IN_PROGRESS, CLOSED
    }

    public static class ProjectBuilder {
        private Long id;
        private String title;
        private String description;
        private List<String> requiredSkills = new ArrayList<>();
        private User postedBy;
        private ProjectStatus status = ProjectStatus.OPEN;
        private LocalDateTime createdAt;

        public ProjectBuilder id(Long id) { this.id = id; return this; }
        public ProjectBuilder title(String title) { this.title = title; return this; }
        public ProjectBuilder description(String description) { this.description = description; return this; }
        public ProjectBuilder requiredSkills(List<String> requiredSkills) { this.requiredSkills = requiredSkills; return this; }
        public ProjectBuilder postedBy(User postedBy) { this.postedBy = postedBy; return this; }
        public ProjectBuilder status(ProjectStatus status) { this.status = status; return this; }
        public ProjectBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public Project build() {
            return new Project(id, title, description, requiredSkills, postedBy, status, createdAt);
        }
    }
}
