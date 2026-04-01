package com.skillsync.service;

import com.skillsync.dto.*;
import com.skillsync.model.User;
import com.skillsync.model.UserSkill;
import com.skillsync.repository.*;
import com.skillsync.client.AiServiceClient;
import com.skillsync.security.JwtUtil;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;
import com.skillsync.dto.ai.AiUserDto;

@Service
public class UserService {

    private final UserRepository userRepository;
    private final UserSkillRepository userSkillRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtUtil jwtUtil;
    private final AuthenticationManager authenticationManager;
    private final AiServiceClient aiServiceClient;

    public UserService(UserRepository userRepository, 
                       UserSkillRepository userSkillRepository,
                       PasswordEncoder passwordEncoder, 
                       JwtUtil jwtUtil, 
                       AuthenticationManager authenticationManager,
                       AiServiceClient aiServiceClient) {
        this.userRepository = userRepository;
        this.userSkillRepository = userSkillRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtUtil = jwtUtil;
        this.authenticationManager = authenticationManager;
        this.aiServiceClient = aiServiceClient;
    }
    @Transactional
    public AuthResponse registerUser(RegisterRequest request) {
        if (userRepository.existsByEmail(request.getEmail())) {
            throw new RuntimeException("Email already registered: " + request.getEmail());
        }

        User.Goal goal = parseGoal(request.getGoal());

        String defaultName = (request.getName() != null && !request.getName().trim().isEmpty()) 
                ? request.getName() 
                : request.getEmail().split("@")[0];

        User user = User.builder()
                .name(defaultName)
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .bio(request.getBio())
                .goal(goal)
                .build();

        user = userRepository.save(user);

        // Save skills
        if (request.getSkills() != null) {
            UserSkill.SkillLevel level = parseLevel(request.getSkillLevel());
            final User savedUser = user;
            List<UserSkill> skills = request.getSkills().stream()
                    .map(s -> UserSkill.builder()
                            .user(savedUser)
                            .skillName(s)
                            .level(level)
                            .build())
                    .collect(Collectors.toList());
            userSkillRepository.saveAll(skills);
        }

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public AuthResponse loginUser(LoginRequest request) {
        authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(request.getEmail(), request.getPassword())
        );
        User user = userRepository.findByEmail(request.getEmail())
                .orElseThrow(() -> new RuntimeException("User not found"));

        String token = jwtUtil.generateToken(user.getEmail());
        return AuthResponse.builder()
                .token(token)
                .userId(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .build();
    }

    public UserProfileDto getUserProfile(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToProfileDtoWithAi(user);
    }

    public UserProfileDto getUserProfileById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return mapToProfileDtoWithAi(user);
    }

    private UserProfileDto mapToProfileDtoWithAi(User user) {
        UserProfileDto dto = mapToProfileDto(user);
        try {
            // Provide current user data to Python for REAL mode calculation
            List<AiUserDto> users = List.of(mapToAiUserDto(user));
            com.skillsync.dto.ai.AiTrustScoreResponse response = aiServiceClient.getTrustScore(user.getId(), users);
            
            if (response != null && response.getTrustScore() != null) {
                dto.setTrustScore(response.getTrustScore().doubleValue());
            }
        } catch (Exception e) {
            System.err.println("Failed to fetch trust score for user " + user.getId() + ": " + e.getMessage());
        }
        return dto;
    }

    @Transactional
    public UserProfileDto updateProfile(String email, UpdateProfileRequest request) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        if (request.getName() != null) user.setName(request.getName());
        if (request.getBio() != null) user.setBio(request.getBio());
        if (request.getGoal() != null) user.setGoal(parseGoal(request.getGoal()));

        if (request.getSkills() != null) {
            // orphanRemoval=true on User.userSkills means Hibernate will
            // automatically DELETE removed entries when we save — no manual delete needed.
            user.getUserSkills().clear();

            List<UserSkill> newSkills = request.getSkills().stream()
                    .map(s -> UserSkill.builder()
                            .user(user)
                            .skillName(s.getSkillName())
                            .level(parseLevel(s.getLevel()))
                            .category(s.getCategory())
                            .build())
                    .collect(Collectors.toList());
            user.getUserSkills().addAll(newSkills);
        }

        userRepository.save(user);
        return getUserProfile(email);
    }

    public UserMetricsDto getUserMetrics(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return computeMetricsForUser(user);
    }

    public UserMetricsDto getUserMetricsById(Long id) {
        User user = userRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found"));

        return computeMetricsForUser(user);
    }

    private UserMetricsDto computeMetricsForUser(User user) {
        // Calculate capability matrix based on skills
        List<String> frontendSkills = List.of("react", "html", "css", "tailwind", "next", "vue", "angular", "javascript", "typescript");
        List<String> backendSkills = List.of("node", "express", "java", "spring", "python", "fastapi", "django", "sql", "postgresql", "mongodb", "database");
        List<String> logicSkills = List.of("ai", "ml", "algorithms", "data structures", "logic", "c++", "rust", "go");

        int frontendScore = calculateSkillScore(user, frontendSkills);
        int backendScore = calculateSkillScore(user, backendSkills);
        int logicScore = calculateSkillScore(user, logicSkills);

        int streak = computeStreak(user);
        
        return UserMetricsDto.builder()
                .streak(streak)
                .syncTime(computeSyncTime(user))
                .nodesFixed(computeNodesFixed(user))
                .throughput(computeThroughput(user))
                .signals(computeSignals(user))
                .contentCompletion(Math.min(streak * 7, 92))
                .studentSatisfaction(88 + (user.getId().intValue() % 10))
                .assignmentReturns(75 + (user.getId().intValue() % 15))
                .totalStudents(45 + (user.getId().intValue() % 50))
                .totalHours(streak * 2.5f + 10)
                .roadmap(generateRoadmap(user))
                .capabilityMatrix(List.of(
                        new UserMetricsDto.CapabilityMatrixItem("Neural Patterning", frontendScore, "blue"),
                        new UserMetricsDto.CapabilityMatrixItem("Data Architecture", backendScore, "indigo"),
                        new UserMetricsDto.CapabilityMatrixItem("Logic Synthesis", logicScore, "cyan")
                ))
                .sudokuPoints(user.getSudokuPoints() != null ? (int)user.getSudokuPoints() : 0)
                .build();
    }

    private List<MilestoneDto> generateRoadmap(User user) {
        if (user.getGoal() == User.Goal.PROJECT_PARTNER) {
            return List.of(
                new MilestoneDto(1L, "Architecture Sync", "completed", "2d ago"),
                new MilestoneDto(2L, "Core Refactoring", "current", "In Progress"),
                new MilestoneDto(3L, "Neural Integration", "upcoming", "T-Minus 4d"),
                new MilestoneDto(4L, "System Audit", "upcoming", "Next Week")
            );
        } else {
            return List.of(
                new MilestoneDto(1L, "Foundational Logic", "completed", "4d ago"),
                new MilestoneDto(2L, "Advanced Patterns", "current", "Ongoing"),
                new MilestoneDto(3L, "Optimization Phase", "upcoming", "T-Minus 2d"),
                new MilestoneDto(4L, "Final Synthesis", "upcoming", "T-Minus 8d")
            );
        }
    }

    private int calculateSkillScore(User user, List<String> categories) {
        long count = user.getUserSkills().stream()
                .filter(s -> categories.contains(s.getSkillName().toLowerCase()))
                .count();
        int score = (int) (count * 25); // 25% per matching skill
        return Math.min(score + 30, 95); // Base 30%, max 95%
    }

    private int computeStreak(User user) {
        // Mock logic for streak
        return (int) (java.time.Duration.between(user.getCreatedAt(), java.time.LocalDateTime.now()).toDays() % 30) + 1;
    }

    private String computeSyncTime(User user) {
        return (computeStreak(user) * 4) + "h";
    }

    private int computeNodesFixed(User user) {
        return computeStreak(user) / 2;
    }

    private String computeThroughput(User user) {
        return (85 + (computeStreak(user) % 15)) + "%";
    }

    private int computeSignals(User user) {
        return computeStreak(user) % 10;
    }

    @Transactional
    public void incrementSudokuPoints(Long userId, int points) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setSudokuPoints(user.getSudokuPoints() + points);
        userRepository.save(user);
    }

    public List<User> getAllUsers() {
        return userRepository.findAll();
    }

    public UserProfileDto mapToProfileDto(User user) {
        List<UserProfileDto.SkillDto> skillDtos = user.getUserSkills().stream()
                .map(us -> {
                    return UserProfileDto.SkillDto.builder()
                        .skillName(us.getSkillName())
                        .level(us.getLevel().name())
                        .category(us.getCategory())
                        .build();
                })
                .collect(Collectors.toList());

        return UserProfileDto.builder()
                .id(user.getId())
                .name(user.getName())
                .email(user.getEmail())
                .bio(user.getBio())
                .avatarUrl(user.getAvatarUrl())
                .goal(user.getGoal().name())
                .trustScore(user.getTrustScore() != null ? (double)user.getTrustScore() : 72.5)
                .skills(skillDtos)
                .build();
    }

    public List<AiUserDto> getAllAiUsers() {
        return userRepository.findAll().stream().map(this::mapToAiUserDto).collect(Collectors.toList());
    }

    public AiUserDto mapToAiUserDto(User user) {
        List<String> skills = user.getUserSkills().stream()
                .map(UserSkill::getSkillName)
                .collect(Collectors.toList());
                
        String level = "Beginner";
        if (!user.getUserSkills().isEmpty()) {
            level = user.getUserSkills().iterator().next().getLevel().name();
        }
                
        return AiUserDto.builder()
                .userId(user.getId())
                .name(user.getName() != null ? user.getName() : "Unknown")
                .skills(skills)
                .level(level)
                .goal(user.getGoal() != null ? user.getGoal().name() : "General")
                .bio(user.getBio() != null ? user.getBio() : "")
                .joinedDaysAgo(user.getCreatedAt() != null ? 
                    (int) java.time.temporal.ChronoUnit.DAYS.between(user.getCreatedAt(), java.time.LocalDateTime.now()) : 0)
                .build();
    }

    private User.Goal parseGoal(String goal) {
        System.out.println("Processing Neural Goal: " + goal);
        if (goal == null || goal.trim().isEmpty()) return User.Goal.STUDY_BUDDY;
        
        String input = goal.trim().toUpperCase().replace(" ", "_");
        
        // Manual mapping for friendly frontend labels
        if (input.equals("PROJECT") || input.equals("PROJECT_MAKING")) return User.Goal.PROJECT_PARTNER;
        if (input.equals("HACKATHON") || input.equals("HACKATHON_TEAM")) return User.Goal.HACKATHON;
        if (input.equals("STUDY_BUDDY")) return User.Goal.STUDY_BUDDY;

        try {
            return User.Goal.valueOf(input);
        } catch (IllegalArgumentException e) {
            System.err.println("Neural Goal Synthesis Failed for: " + goal + ". Fallback: STUDY_BUDDY");
            return User.Goal.STUDY_BUDDY;
        }
    }

    private UserSkill.SkillLevel parseLevel(String level) {
        if (level == null) return UserSkill.SkillLevel.BEGINNER;
        try {
            // Check for INTERMEDIATE since the frontend might send "Mid"
            if (level.equalsIgnoreCase("Mid")) return UserSkill.SkillLevel.INTERMEDIATE;
            if (level.equalsIgnoreCase("Pro")) return UserSkill.SkillLevel.EXPERT;
            return UserSkill.SkillLevel.valueOf(level.toUpperCase());
        } catch (IllegalArgumentException e) {
            return UserSkill.SkillLevel.BEGINNER;
        }
    }
}