package com.skillsync.model;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

@Entity
@Table(name = "user_skills")
public class UserSkill {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    @JsonIgnore
    private User user;

    @Column(nullable = false)
    private String skillName;

    private String category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SkillLevel level;

    public UserSkill() {}

    public UserSkill(Long id, User user, String skillName, String category, SkillLevel level) {
        this.id = id;
        this.user = user;
        this.skillName = skillName;
        this.category = category;
        this.level = level != null ? level : SkillLevel.BEGINNER;
    }

    public static UserSkillBuilder builder() {
        return new UserSkillBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }
    public String getSkillName() { return skillName; }
    public void setSkillName(String skillName) { this.skillName = skillName; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }
    public SkillLevel getLevel() { return level; }
    public void setLevel(SkillLevel level) { this.level = level; }

    public enum SkillLevel {
        BEGINNER, INTERMEDIATE, EXPERT
    }

    public static class UserSkillBuilder {
        private Long id;
        private User user;
        private String skillName;
        private String category;
        private SkillLevel level;

        public UserSkillBuilder id(Long id) { this.id = id; return this; }
        public UserSkillBuilder user(User user) { this.user = user; return this; }
        public UserSkillBuilder skillName(String skillName) { this.skillName = skillName; return this; }
        public UserSkillBuilder category(String category) { this.category = category; return this; }
        public UserSkillBuilder level(SkillLevel level) { this.level = level; return this; }
        public UserSkill build() {
            return new UserSkill(id, user, skillName, category, level);
        }
    }
}
