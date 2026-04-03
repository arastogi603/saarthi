package com.skillsync.client;

import com.skillsync.dto.ai.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.util.List;

@Service
public class AiServiceClient {

    private static final Logger log = LoggerFactory.getLogger(AiServiceClient.class);
    private final RestTemplate restTemplate;
    private final ObjectMapper objectMapper;
    
    @Value("${python.backend.url:https://abhishek18-dev-saarthi.hf.space}")
    private String baseUrl;

    public AiServiceClient() {
        this.restTemplate = new RestTemplate();
        this.objectMapper = new ObjectMapper();
    }

    public AiMatchResult[] getMatchUsers(Long userId, List<AiUserDto> users) {
        String url = baseUrl + "/api/v1/match-users";
        AiMatchRequest request = AiMatchRequest.builder()
                .userId(userId)
                .users(users)
                .build();
        logData("Sending MATCH request to Python", url, request);
        try {
            AiMatchResult[] response = restTemplate.postForObject(url, request, AiMatchResult[].class);
            logData("Received MATCH response from Python", url, response);
            return response != null ? response : new AiMatchResult[0];
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("AI MATCH failed: {} - Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI Matching service error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        }
    }

    public AiTeamMember[] buildTeam(Long userId, int teamSize, List<AiUserDto> users) {
        String url = baseUrl + "/api/v1/build-team";
        AiTeamRequest request = AiTeamRequest.builder()
                .userId(userId)
                .teamSize(teamSize)
                .users(users)
                .build();
        logData("Sending TEAM request to Python", url, request);
        AiTeamMember[] response = restTemplate.postForObject(url, request, AiTeamMember[].class);
        logData("Received TEAM response from Python", url, response);
        return response;
    }

    public AiRecommendResponse getRecommendations(Long userId, List<AiUserDto> users) {
        String url = baseUrl + "/api/v1/recommendations";
        AiRecommendRequest request = AiRecommendRequest.builder()
                .userId(userId)
                .users(users)
                .build();
        logData("Sending RECOMMENDATIONS request to Python", url, request);
        try {
            AiRecommendResponse response = restTemplate.postForObject(url, request, AiRecommendResponse.class);
            logData("Received RECOMMENDATIONS response from Python", url, response);
            return response;
        } catch (org.springframework.web.client.HttpClientErrorException e) {
            log.error("AI RECOMMEND failed: {} - Body: {}", e.getStatusCode(), e.getResponseBodyAsString());
            throw new RuntimeException("AI Recommendation service error (" + e.getStatusCode() + "): " + e.getResponseBodyAsString());
        }
    }

    public AiTrustScoreResponse getTrustScore(Long userId, List<AiUserDto> users) {
        String url = baseUrl + "/api/v1/trust-score";
        AiTrustScoreRequest request = AiTrustScoreRequest.builder()
                .userId(userId)
                .users(users)
                .build();
        logData("Sending TRUST SCORE request to Python", url, request);
        AiTrustScoreResponse response = restTemplate.postForObject(url, request, AiTrustScoreResponse.class);
        logData("Received TRUST SCORE response from Python", url, response);
        return response;
    }

    public AiRecommendResponse.ProjectSuggestion[] suggestProjects(List<String> skills) {
        String url = baseUrl + "/api/v1/suggest-projects";
        AiSuggestProjectsRequest request = AiSuggestProjectsRequest.builder()
                .skills(skills)
                .build();
        logData("Sending SUGGEST PROJECTS request to Python", url, request);
        AiRecommendResponse.ProjectSuggestion[] response = restTemplate.postForObject(url, request, AiRecommendResponse.ProjectSuggestion[].class);
        logData("Received SUGGEST PROJECTS response from Python", url, response);
        return response;
    }

    private void logData(String prefix, String url, Object data) {
        try {
            String json = objectMapper.writerWithDefaultPrettyPrinter().writeValueAsString(data);
            log.info("\n======================================================\n" +
                     "{} [{}]\n" +
                     "DATA:\n{}\n" +
                     "======================================================", prefix, url, json);
        } catch (JsonProcessingException e) {
            log.warn("Could not serialize data for logging", e);
        }
    }
}
