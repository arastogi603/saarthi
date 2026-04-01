package com.skillsync.dto;

public class MilestoneDto {
    private Long id;
    private String title;
    private String status; // completed, current, upcoming
    private String time;

    public MilestoneDto() {}

    public MilestoneDto(Long id, String title, String status, String time) {
        this.id = id;
        this.title = title;
        this.status = status;
        this.time = time;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
    public String getTime() { return time; }
    public void setTime(String time) { this.time = time; }

    public static MilestoneDtoBuilder builder() {
        return new MilestoneDtoBuilder();
    }

    public static class MilestoneDtoBuilder {
        private Long id;
        private String title;
        private String status;
        private String time;

        public MilestoneDtoBuilder id(Long id) { this.id = id; return this; }
        public MilestoneDtoBuilder title(String title) { this.title = title; return this; }
        public MilestoneDtoBuilder status(String status) { this.status = status; return this; }
        public MilestoneDtoBuilder time(String time) { this.time = time; return this; }
        public MilestoneDto build() {
            return new MilestoneDto(id, title, status, time);
        }
    }
}
