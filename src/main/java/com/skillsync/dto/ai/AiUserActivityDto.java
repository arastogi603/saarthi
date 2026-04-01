package com.skillsync.dto.ai;

public class AiUserActivityDto {
    private int daysActive = 0;
    private int projectsJoined = 0;
    private int contributions = 0;
    private int lastActiveDaysAgo = 30;

    public AiUserActivityDto() {}

    public AiUserActivityDto(int daysActive, int projectsJoined, int contributions, int lastActiveDaysAgo) {
        this.daysActive = daysActive;
        this.projectsJoined = projectsJoined;
        this.contributions = contributions;
        this.lastActiveDaysAgo = lastActiveDaysAgo;
    }

    public static Builder builder() {
        return new Builder();
    }

    public static class Builder {
        private int daysActive = 0;
        private int projectsJoined = 0;
        private int contributions = 0;
        private int lastActiveDaysAgo = 30;

        public Builder daysActive(int daysActive) { this.daysActive = daysActive; return this; }
        public Builder projectsJoined(int projectsJoined) { this.projectsJoined = projectsJoined; return this; }
        public Builder contributions(int contributions) { this.contributions = contributions; return this; }
        public Builder lastActiveDaysAgo(int lastActiveDaysAgo) { this.lastActiveDaysAgo = lastActiveDaysAgo; return this; }

        public AiUserActivityDto build() {
            return new AiUserActivityDto(daysActive, projectsJoined, contributions, lastActiveDaysAgo);
        }
    }

    public int getDaysActive() { return daysActive; }
    public void setDaysActive(int daysActive) { this.daysActive = daysActive; }
    public int getProjectsJoined() { return projectsJoined; }
    public void setProjectsJoined(int projectsJoined) { this.projectsJoined = projectsJoined; }
    public int getContributions() { return contributions; }
    public void setContributions(int contributions) { this.contributions = contributions; }
    public int getLastActiveDaysAgo() { return lastActiveDaysAgo; }
    public void setLastActiveDaysAgo(int lastActiveDaysAgo) { this.lastActiveDaysAgo = lastActiveDaysAgo; }
}
