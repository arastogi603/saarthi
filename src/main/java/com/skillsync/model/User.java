package com.skillsync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "users")
public class User {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String name;

    @Column(unique = true, nullable = false)
    private String email;

    @JsonIgnore
    @Column(nullable = false)
    private String password;

    private String bio;

    private String avatarUrl;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private Goal goal = Goal.STUDY_BUDDY;

    @Column(nullable = false, columnDefinition = "float default 0.0")
    private Double trustScore = 0.0;
    
    @Column(nullable = false, columnDefinition = "integer default 0")
    private Integer sudokuPoints = 0;

    @OneToMany(mappedBy = "user", cascade = CascadeType.ALL, orphanRemoval = true, fetch = FetchType.EAGER)
    private List<UserSkill> userSkills = new ArrayList<>();

    @Enumerated(EnumType.STRING)
    private Role role = Role.USER;

    @CreationTimestamp
    private LocalDateTime createdAt;

    public User() {}

    public User(Long id, String name, String email, String password, String bio, String avatarUrl, Goal goal, Double trustScore, Integer sudokuPoints, List<UserSkill> userSkills, Role role, LocalDateTime createdAt) {
        this.id = id;
        this.name = name;
        this.email = email;
        this.password = password;
        this.bio = bio;
        this.avatarUrl = avatarUrl;
        this.goal = goal != null ? goal : Goal.STUDY_BUDDY;
        this.trustScore = trustScore != null ? trustScore : 0.0;
        this.sudokuPoints = sudokuPoints != null ? sudokuPoints : 0;
        this.userSkills = userSkills != null ? userSkills : new ArrayList<>();
        this.role = role != null ? role : Role.USER;
        this.createdAt = createdAt;
    }

    public static UserBuilder builder() {
        return new UserBuilder();
    }

    // Manual Getter/Setter for core properties
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    public String getBio() { return bio; }
    public void setBio(String bio) { this.bio = bio; }
    public String getAvatarUrl() { return avatarUrl; }
    public void setAvatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; }
    public Goal getGoal() { return goal; }
    public void setGoal(Goal goal) { this.goal = goal; }
    public Double getTrustScore() { return trustScore; }
    public void setTrustScore(Double trustScore) { this.trustScore = trustScore; }
    public Integer getSudokuPoints() { return sudokuPoints; }
    public void setSudokuPoints(Integer sudokuPoints) { this.sudokuPoints = sudokuPoints; }
    public List<UserSkill> getUserSkills() { return userSkills; }
    public void setUserSkills(List<UserSkill> userSkills) { this.userSkills = userSkills; }
    public Role getRole() { return role; }
    public void setRole(Role role) { this.role = role; }
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public enum Goal {
        PROJECT_PARTNER, STUDY_BUDDY, HACKATHON, DISCUSSION_GROUP, TEAM_MEMBER, PLACEMENT_PREP
    }

    public enum Role {
        USER, ADMIN
    }

    public static class UserBuilder {
        private Long id;
        private String name;
        private String email;
        private String password;
        private String bio;
        private String avatarUrl;
        private Goal goal = Goal.STUDY_BUDDY;
        private Double trustScore = 0.0;
        private Integer sudokuPoints = 0;
        private List<UserSkill> userSkills = new ArrayList<>();
        private Role role = Role.USER;
        private LocalDateTime createdAt;

        public UserBuilder id(Long id) { this.id = id; return this; }
        public UserBuilder name(String name) { this.name = name; return this; }
        public UserBuilder email(String email) { this.email = email; return this; }
        public UserBuilder password(String password) { this.password = password; return this; }
        public UserBuilder bio(String bio) { this.bio = bio; return this; }
        public UserBuilder avatarUrl(String avatarUrl) { this.avatarUrl = avatarUrl; return this; }
        public UserBuilder goal(Goal goal) { this.goal = goal; return this; }
        public UserBuilder trustScore(Double trustScore) { this.trustScore = trustScore; return this; }
        public UserBuilder sudokuPoints(Integer sudokuPoints) { this.sudokuPoints = sudokuPoints; return this; }
        public UserBuilder userSkills(List<UserSkill> userSkills) { this.userSkills = userSkills; return this; }
        public UserBuilder role(Role role) { this.role = role; return this; }
        public UserBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public User build() {
            return new User(id, name, email, password, bio, avatarUrl, goal, trustScore, sudokuPoints, userSkills, role, createdAt);
        }
    }
}