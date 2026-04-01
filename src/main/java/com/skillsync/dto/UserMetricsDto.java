package com.skillsync.dto;

import java.util.List;

public class UserMetricsDto {
    private int streak;
    private String syncTime;
    private int nodesFixed;
    private String throughput;
    private int signals;
    private List<MilestoneDto> roadmap;
    private int contentCompletion;
    private int studentSatisfaction;
    private int assignmentReturns;
    private int totalStudents;
    private float totalHours;
    private int sudokuPoints;
    private List<CapabilityMatrixItem> capabilityMatrix;

    public UserMetricsDto() {}

    public UserMetricsDto(int streak, String syncTime, int nodesFixed, String throughput, int signals, 
                          List<MilestoneDto> roadmap, int contentCompletion, int studentSatisfaction, 
                          int assignmentReturns, int totalStudents, float totalHours, int sudokuPoints,
                          List<CapabilityMatrixItem> capabilityMatrix) {
        this.streak = streak;
        this.syncTime = syncTime;
        this.nodesFixed = nodesFixed;
        this.throughput = throughput;
        this.signals = signals;
        this.roadmap = roadmap;
        this.contentCompletion = contentCompletion;
        this.studentSatisfaction = studentSatisfaction;
        this.assignmentReturns = assignmentReturns;
        this.totalStudents = totalStudents;
        this.totalHours = totalHours;
        this.sudokuPoints = sudokuPoints;
        this.capabilityMatrix = capabilityMatrix;
    }

    // Getters and Setters
    public int getStreak() { return streak; }
    public void setStreak(int streak) { this.streak = streak; }
    public String getSyncTime() { return syncTime; }
    public void setSyncTime(String syncTime) { this.syncTime = syncTime; }
    public int getNodesFixed() { return nodesFixed; }
    public void setNodesFixed(int nodesFixed) { this.nodesFixed = nodesFixed; }
    public String getThroughput() { return throughput; }
    public void setThroughput(String throughput) { this.throughput = throughput; }
    public int getSignals() { return signals; }
    public void setSignals(int signals) { this.signals = signals; }
    public List<MilestoneDto> getRoadmap() { return roadmap; }
    public void setRoadmap(List<MilestoneDto> roadmap) { this.roadmap = roadmap; }
    public int getContentCompletion() { return contentCompletion; }
    public void setContentCompletion(int contentCompletion) { this.contentCompletion = contentCompletion; }
    public int getStudentSatisfaction() { return studentSatisfaction; }
    public void setStudentSatisfaction(int studentSatisfaction) { this.studentSatisfaction = studentSatisfaction; }
    public int getAssignmentReturns() { return assignmentReturns; }
    public void setAssignmentReturns(int assignmentReturns) { this.assignmentReturns = assignmentReturns; }
    public int getTotalStudents() { return totalStudents; }
    public void setTotalStudents(int totalStudents) { this.totalStudents = totalStudents; }
    public float getTotalHours() { return totalHours; }
    public void setTotalHours(float totalHours) { this.totalHours = totalHours; }
    public int getSudokuPoints() { return sudokuPoints; }
    public void setSudokuPoints(int sudokuPoints) { this.sudokuPoints = sudokuPoints; }
    public List<CapabilityMatrixItem> getCapabilityMatrix() { return capabilityMatrix; }
    public void setCapabilityMatrix(List<CapabilityMatrixItem> capabilityMatrix) { this.capabilityMatrix = capabilityMatrix; }

    public static UserMetricsDtoBuilder builder() {
        return new UserMetricsDtoBuilder();
    }

    public static class UserMetricsDtoBuilder {
        private int streak;
        private String syncTime;
        private int nodesFixed;
        private String throughput;
        private int signals;
        private List<MilestoneDto> roadmap;
        private int contentCompletion;
        private int studentSatisfaction;
        private int assignmentReturns;
        private int totalStudents;
        private float totalHours;
        private int sudokuPoints;
        private List<CapabilityMatrixItem> capabilityMatrix;

        public UserMetricsDtoBuilder streak(int streak) { this.streak = streak; return this; }
        public UserMetricsDtoBuilder syncTime(String syncTime) { this.syncTime = syncTime; return this; }
        public UserMetricsDtoBuilder nodesFixed(int nodesFixed) { this.nodesFixed = nodesFixed; return this; }
        public UserMetricsDtoBuilder throughput(String throughput) { this.throughput = throughput; return this; }
        public UserMetricsDtoBuilder signals(int signals) { this.signals = signals; return this; }
        public UserMetricsDtoBuilder roadmap(List<MilestoneDto> roadmap) { this.roadmap = roadmap; return this; }
        public UserMetricsDtoBuilder contentCompletion(int contentCompletion) { this.contentCompletion = contentCompletion; return this; }
        public UserMetricsDtoBuilder studentSatisfaction(int studentSatisfaction) { this.studentSatisfaction = studentSatisfaction; return this; }
        public UserMetricsDtoBuilder assignmentReturns(int assignmentReturns) { this.assignmentReturns = assignmentReturns; return this; }
        public UserMetricsDtoBuilder totalStudents(int totalStudents) { this.totalStudents = totalStudents; return this; }
        public UserMetricsDtoBuilder totalHours(float totalHours) { this.totalHours = totalHours; return this; }
        public UserMetricsDtoBuilder sudokuPoints(int sudokuPoints) { this.sudokuPoints = sudokuPoints; return this; }
        public UserMetricsDtoBuilder capabilityMatrix(List<CapabilityMatrixItem> capabilityMatrix) { this.capabilityMatrix = capabilityMatrix; return this; }
        public UserMetricsDto build() {
            return new UserMetricsDto(streak, syncTime, nodesFixed, throughput, signals, 
                                      roadmap, contentCompletion, studentSatisfaction, 
                                      assignmentReturns, totalStudents, totalHours, sudokuPoints, capabilityMatrix);
        }
    }

    public static class CapabilityMatrixItem {
        private String label;
        private int val;
        private String color;

        public CapabilityMatrixItem() {}

        public CapabilityMatrixItem(String label, int val, String color) {
            this.label = label;
            this.val = val;
            this.color = color;
        }

        public String getLabel() { return label; }
        public void setLabel(String label) { this.label = label; }
        public int getVal() { return val; }
        public void setVal(int val) { this.val = val; }
        public String getColor() { return color; }
        public void setColor(String color) { this.color = color; }
    }
}
