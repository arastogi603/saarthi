package com.skillsync.service;

import com.skillsync.client.AiServiceClient;
import com.skillsync.dto.MatchResponse;
import com.skillsync.dto.ai.AiMatchResult;
import com.skillsync.dto.ai.AiRecommendResponse;
import com.skillsync.dto.ai.AiUserDto;
import com.skillsync.model.Project;
import com.skillsync.model.Match;
import com.skillsync.model.User;
import com.skillsync.repository.MatchRepository;
import com.skillsync.repository.UserRepository;
import com.skillsync.repository.ProjectRepository;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.*;
import java.util.stream.Collectors;

@Service
public class MatchService {



    private final MatchRepository matchRepository;
    private final UserRepository userRepository;
    private final UserService userService;
    private final AiServiceClient aiServiceClient;
    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;
    private final ProjectRepository projectRepository;

    public MatchService(MatchRepository matchRepository, 
                        UserRepository userRepository, 
                        UserService userService, 
                        AiServiceClient aiServiceClient,
                        ChatService chatService,
                        SimpMessagingTemplate messagingTemplate,
                        ProjectRepository projectRepository) {
        this.matchRepository = matchRepository;
        this.userRepository = userRepository;
        this.userService = userService;
        this.aiServiceClient = aiServiceClient;
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
        this.projectRepository = projectRepository;
    }

    /**
     * Finds and persists match scores for the current user against all others using the Python AI Service.
     */
    @Transactional
    public List<MatchResponse> findMatches(String email) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        List<MatchResponse> responses = new ArrayList<>();
        List<AiUserDto> allUsers = userService.getAllAiUsers();
        
        // 1. Try AI Service for matching
        Map<Long, Double> aiScores = new HashMap<>();
        try {
             AiMatchResult[] aiResponse = aiServiceClient.getMatchUsers(currentUser.getId(), allUsers);
             for (AiMatchResult res : aiResponse) {
                 aiScores.put(res.getUserId(), res.getMatchScore());
             }
        } catch (Exception e) {
             System.err.println("AI Service currently offline, using Skill-Based Fallback sync: " + e.getMessage());
        }

        Set<String> mySkills = currentUser.getUserSkills().stream()
                .map(us -> us.getSkillName().toLowerCase())
                .collect(Collectors.toSet());

        // 2. Process all users and calculate hybrid score
        for (AiUserDto otherDto : allUsers) {
            if (otherDto.getUserId().equals(currentUser.getId())) continue;

            double score = aiScores.getOrDefault(otherDto.getUserId(), 0.0);
            
            // Skill-based Fallback calculation
            if (score <= 0.0) {
                Set<String> theirSkills = new HashSet<>(otherDto.getSkills().stream()
                        .map(String::toLowerCase).collect(Collectors.toList()));
                
                long overlap = mySkills.stream().filter(theirSkills::contains).count();
                if (overlap > 0) {
                    // Manual score: 30% base + 15% per matching skill, max 85%
                    score = Math.min(30.0 + (overlap * 15.0), 85.0);
                }
            }

            // If still 0 score, we ignore them in discovery unless they are explicitly searched
            if (score <= 0.0 && !mySkills.isEmpty()) continue;

            User other = userRepository.findById(otherDto.getUserId()).orElse(null);
            if (other == null || !other.isSearchActive()) continue;

            // Important: We do NOT save a Match record here anymore.
            // Search / Discover should be READ-ONLY until the user clicks "Initiate Uplink".
            
            // We check if a match ALREADY exists to show the current Status
            Optional<Match> existing = matchRepository.findByUsers(currentUser.getId(), other.getId());
            String status = existing.map(m -> m.getStatus().name()).orElse("NONE");

            responses.add(MatchResponse.builder()
                    .matchId(existing.map(Match::getId).orElse(other.getId())) // Using user ID as a temporary 'matchId' if no record exists
                    .matchedUser(userService.mapToProfileDto(other))
                    .score(Math.round(score * 10.0) / 10.0)
                    .status(status)
                    .senderId(existing.map(m -> m.getUser1().getId()).orElse(null))
                    .commonSkills(mySkills.stream().filter(s -> otherDto.getSkills().stream().anyMatch(os -> os.equalsIgnoreCase(s))).collect(Collectors.toList()))
                    .projectId(projectRepository.findByPostedById(other.getId()).stream()
                        .filter(p -> p.getStatus() == Project.ProjectStatus.OPEN)
                        .findFirst()
                        .map(Project::getId)
                        .orElse(null))
                    .projectSkills(projectRepository.findByPostedById(other.getId()).stream()
                        .filter(p -> p.getStatus() == Project.ProjectStatus.OPEN)
                        .findFirst()
                        .map(Project::getRequiredSkills)
                        .orElse(null))
                    .build());
        }

        // Provide randomized variety for the swipe interface
        Collections.shuffle(responses);
        return responses;
    }

    public AiRecommendResponse getRecommendations(String email, int page, int limit) {
        User currentUser = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        try {
             return aiServiceClient.getRecommendations(currentUser.getId(), userService.getAllAiUsers());
        } catch (Exception e) {
             throw new RuntimeException("Failed to fetch AI recommendations: " + e.getMessage());
        }
    }

    public List<MatchResponse> getMyMatches(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return matchRepository.findMatchesForUser(user.getId()).stream()
                .map(m -> {
                    User other = m.getUser1().getId().equals(user.getId()) ? m.getUser2() : m.getUser1();
                    Set<String> mySkills = user.getUserSkills().stream()
                            .map(us -> us.getSkillName().toLowerCase()).collect(Collectors.toSet());
                    Set<String> theirSkills = other.getUserSkills().stream()
                            .map(us -> us.getSkillName().toLowerCase()).collect(Collectors.toSet());
                    List<String> common = new ArrayList<>(mySkills);
                    common.retainAll(theirSkills);

                    return MatchResponse.builder()
                            .matchId(m.getId())
                            .matchedUser(userService.mapToProfileDto(other))
                            .score(m.getScore())
                            .status(m.getStatus().name())
                            .commonSkills(common)
                            .createdAt(m.getCreatedAt().toString())
                            .senderId(m.getUser1().getId())
                            .projectId(m.getProjectId())
                            .fulfilledSkill(m.getFulfilledSkill())
                            .build();
                })
                .sorted(Comparator.comparingDouble(MatchResponse::getScore).reversed())
                .collect(Collectors.toList());
    }

    @Transactional
    public MatchResponse updateMatchStatus(Long matchId, String status, String email, String fulfilledSkill) {
        Match match = matchRepository.findById(matchId)
                .orElseThrow(() -> new RuntimeException("Match not found"));

        if (fulfilledSkill != null) {
            match.setFulfilledSkill(fulfilledSkill);
        }

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Verify the user is part of this match
        if (!match.getUser1().getId().equals(user.getId()) &&
            !match.getUser2().getId().equals(user.getId())) {
            throw new RuntimeException("Not authorized to update this match");
        }

        try {
            match.setStatus(Match.MatchStatus.valueOf(status.toUpperCase()));
        } catch (IllegalArgumentException e) {
            throw new RuntimeException("Invalid match status: " + status + ". Use ACCEPTED or REJECTED.");
        }
        
        final Match savedMatch = matchRepository.save(match);
        User other = savedMatch.getUser1().getId().equals(user.getId()) ? savedMatch.getUser2() : savedMatch.getUser1();

        // REAL-TIME HANDSHAKE ACTIVATION
        if (savedMatch.getStatus() == Match.MatchStatus.ACCEPTED) {
             // 1. Requirement Lifecycle Logic
             if (user.getGoal() == User.Goal.STUDY_BUDDY) {
                 user.setSearchActive(false);
                 userRepository.save(user);
             }

             // 2. Project/Team Formation Logic
             if (savedMatch.getProjectId() != null) {
                 Optional<Project> optProject = projectRepository.findById(savedMatch.getProjectId());
                 if (optProject.isPresent()) {
                     Project project = optProject.get();
                     
                     // Fulfilled Skill removal
                     final String skill = savedMatch.getFulfilledSkill();
                     if (skill != null) {
                         project.getRequiredSkills().removeIf(s -> s.equalsIgnoreCase(skill));
                     }
                     
                     // Join Group Chat Cluster
                     if (project.getChatRoom() != null) {
                         chatService.addMemberToRoom(project.getChatRoom().getId(), other.getId());
                     }
                     
                     // Increment team count
                     project.setMembersCount(project.getMembersCount() + 1);
                     if (project.getMembersCount() >= project.getMaxMembers()) {
                         project.setStatus(Project.ProjectStatus.CLOSED);
                     }
                     projectRepository.save(project);
                 }
             }

             // 3. Automatically Provision Private Cluster (Chat Room) for 1:1 if not project
             try {
                if (savedMatch.getProjectId() == null) {
                    chatService.getOrCreatePrivateRoom(user.getEmail(), other.getId());
                }
                
                // 4. Broadcast Neural Handshake Complete Signal to BOTH nodes
                Map<String, Object> signal = new HashMap<>();
                signal.put("type", "HANDSHAKE_COMPLETE");
                signal.put("peerName", user.getName());
                signal.put("matchId", savedMatch.getId());
                
                messagingTemplate.convertAndSendToUser(user.getEmail(), "/queue/notifications", signal);
                messagingTemplate.convertAndSendToUser(other.getEmail(), "/queue/notifications", signal);
                
             } catch (Exception e) {
                System.err.println("Failed to provision cluster/broadcast: " + e.getMessage());
             }
        }

        return MatchResponse.builder()
                .matchId(savedMatch.getId())
                .matchedUser(userService.mapToProfileDto(other))
                .score(savedMatch.getScore())
                .status(savedMatch.getStatus().name())
                .projectId(savedMatch.getProjectId())
                .fulfilledSkill(savedMatch.getFulfilledSkill())
                .build();
    }

    public List<MatchResponse> getPendingRequests(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return matchRepository.findPendingByRecipient(user.getId()).stream()
                .map(m -> {
                    User sender = m.getUser1();
                    Set<String> recipientSkills = user.getUserSkills().stream()
                            .map(us -> us.getSkillName().toLowerCase()).collect(Collectors.toSet());
                    Set<String> senderSkills = sender.getUserSkills().stream()
                            .map(us -> us.getSkillName().toLowerCase()).collect(Collectors.toSet());
                    List<String> common = new ArrayList<>(recipientSkills);
                    common.retainAll(senderSkills);

                    return MatchResponse.builder()
                            .matchId(m.getId())
                            .matchedUser(userService.mapToProfileDto(sender))
                            .score(m.getScore())
                            .status(m.getStatus().name())
                            .commonSkills(common)
                            .createdAt(m.getCreatedAt() != null ? m.getCreatedAt().toString() : "")
                            .senderId(m.getUser1().getId())
                            .projectId(m.getProjectId())
                            .fulfilledSkill(m.getFulfilledSkill())
                            .build();
                })
                .collect(Collectors.toList());
    }

    @Transactional
    public MatchResponse requestMatch(Long targetUserId, String senderEmail, Long projectId, String fulfilledSkill) {
        User sender = userRepository.findByEmail(senderEmail)
                .orElseThrow(() -> new RuntimeException("Sender not found"));
        User target = userRepository.findById(targetUserId)
                .orElseThrow(() -> new RuntimeException("Target user not found"));

        if (sender.getId().equals(target.getId())) {
            throw new RuntimeException("You cannot match with yourself");
        }

        // Check if a match already exists
        Optional<Match> existing = matchRepository.findByUsers(sender.getId(), target.getId());
        Match match;
        if (existing.isPresent()) {
            match = existing.get();
            // If already ACCEPTED, don't revert to PENDING
            if (match.getStatus() != Match.MatchStatus.ACCEPTED) {
                match.setStatus(Match.MatchStatus.PENDING);
                // Important: Ensure the sender is set as user1 so the recipient sees it as INCOMING
                match.setUser1(sender);
                match.setUser2(target);
            }
        } else {
            // Initial score Calculation (reuse discovery logic or default)
            double score = 75.0; 
            match = Match.builder()
                    .user1(sender)
                    .user2(target)
                    .score(score)
                    .status(Match.MatchStatus.PENDING)
                    .build();
        }
        
        if (projectId != null) match.setProjectId(projectId);
        if (fulfilledSkill != null) match.setFulfilledSkill(fulfilledSkill);

        Match saved = matchRepository.save(match);
        return mapToResponse(saved, target);
    }

    private MatchResponse mapToResponse(Match match, User other) {
        return MatchResponse.builder()
                .matchId(match.getId())
                .matchedUser(userService.mapToProfileDto(other))
                .score(match.getScore())
                .status(match.getStatus().name())
                .createdAt(match.getCreatedAt() != null ? match.getCreatedAt().toString() : "")
                .senderId(match.getUser1().getId())
                .projectId(match.getProjectId())
                .fulfilledSkill(match.getFulfilledSkill())
                .build();
    }
}
