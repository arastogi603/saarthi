package com.skillsync.service;

import com.skillsync.client.AiServiceClient;
import com.skillsync.dto.ai.AiTeamMember;
import com.skillsync.model.User;
import com.skillsync.repository.UserRepository;
import org.springframework.stereotype.Service;

@Service
public class TeamService {

    private final UserRepository userRepository;
    private final UserService userService;
    private final AiServiceClient aiServiceClient;

    public TeamService(UserRepository userRepository, 
                       UserService userService, 
                       AiServiceClient aiServiceClient) {
        this.userRepository = userRepository;
        this.userService = userService;
        this.aiServiceClient = aiServiceClient;
    }

    public AiTeamMember[] buildTeamForUser(String email, int teamSize) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        return aiServiceClient.buildTeam(user.getId(), teamSize, userService.getAllAiUsers());
    }
}
