package com.skillsync.model;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "sessions")
public class Session {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(nullable = false)
    private String author;

    @Column(nullable = false)
    private String duration;

    @Column(nullable = false)
    private String type; // e.g., "LIVE", "WORKSHOP"

    @Column(nullable = false)
    private LocalDateTime startTime;

    private int attendees;
    
    private String category;

    public Session() {}

    public Session(Long id, String title, String author, String duration, String type, LocalDateTime startTime, int attendees, String category) {
        this.id = id;
        this.title = title;
        this.author = author;
        this.duration = duration;
        this.type = type;
        this.startTime = startTime;
        this.attendees = attendees;
        this.category = category;
    }

    public static SessionBuilder builder() {
        return new SessionBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getAuthor() { return author; }
    public void setAuthor(String author) { this.author = author; }
    public String getDuration() { return duration; }
    public void setDuration(String duration) { this.duration = duration; }
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
    public LocalDateTime getStartTime() { return startTime; }
    public void setStartTime(LocalDateTime startTime) { this.startTime = startTime; }
    public int getAttendees() { return attendees; }
    public void setAttendees(int attendees) { this.attendees = attendees; }
    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public static class SessionBuilder {
        private Long id;
        private String title;
        private String author;
        private String duration;
        private String type;
        private LocalDateTime startTime;
        private int attendees;
        private String category;

        public SessionBuilder id(Long id) { this.id = id; return this; }
        public SessionBuilder title(String title) { this.title = title; return this; }
        public SessionBuilder author(String author) { this.author = author; return this; }
        public SessionBuilder duration(String duration) { this.duration = duration; return this; }
        public SessionBuilder type(String type) { this.type = type; return this; }
        public SessionBuilder startTime(LocalDateTime startTime) { this.startTime = startTime; return this; }
        public SessionBuilder attendees(int attendees) { this.attendees = attendees; return this; }
        public SessionBuilder category(String category) { this.category = category; return this; }
        public Session build() {
            return new Session(id, title, author, duration, type, startTime, attendees, category);
        }
    }
}
