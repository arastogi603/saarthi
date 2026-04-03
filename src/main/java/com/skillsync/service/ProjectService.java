package com.skillsync.service;

import com.skillsync.dto.ProjectRequest;
import com.skillsync.model.Project;
import com.skillsync.model.ChatRoom;
import com.skillsync.client.AiServiceClient;
import com.skillsync.dto.ai.AiRecommendResponse;
import com.skillsync.model.User;
import com.skillsync.repository.ProjectRepository;
import com.skillsync.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ProjectService {

    private final ProjectRepository projectRepository;
    private final UserRepository userRepository;
    private final AiServiceClient aiServiceClient;
    private final ChatService chatService;

    public ProjectService(ProjectRepository projectRepository, 
                          UserRepository userRepository, 
                          AiServiceClient aiServiceClient,
                          ChatService chatService) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.aiServiceClient = aiServiceClient;
        this.chatService = chatService;
    }

    public List<Project> getAllProjects() {
        return projectRepository.findAll();
    }

    public Project getProjectById(Long id) {
        return projectRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Project not found with id: " + id));
    }

    @Transactional
    public Project createProject(ProjectRequest request, String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));

        // Single-session policy: Update existing project if found
        List<Project> existing = projectRepository.findByPostedById(user.getId());
        Project project = existing.isEmpty() ? new Project() : existing.get(0);

        project.setTitle(request.getTitle());
        project.setDescription(request.getDescription());
        project.setRequiredSkills(request.getRequiredSkills());
        project.setPostedBy(user);
        project.setMaxMembers(request.getMaxMembers() != null ? request.getMaxMembers() : 1);
        
        if (existing.isEmpty()) {
            project.setMembersCount(1);
            project.setStatus(Project.ProjectStatus.OPEN);
            
            // Create a ChatRoom for the project/team
            ChatRoom room = chatService.createRoom(
                "Team: " + request.getTitle(), 
                new java.util.ArrayList<>(java.util.List.of(user.getId()))
            );
            project.setChatRoom(room);
        } else {
            // Update room name if title changed
            if (project.getChatRoom() != null) {
                project.getChatRoom().setName("Team: " + request.getTitle());
            }
        }

        return projectRepository.save(project);
    }

    @Transactional
    public void deleteProject(Long id, String email) {
        Project project = getProjectById(id);
        if (!project.getPostedBy().getEmail().equals(email)) {
            throw new RuntimeException("You can only delete your own projects");
        }
        projectRepository.delete(project);
    }

    public List<Project> searchBySkill(String skill) {
        return projectRepository.searchBySkill(skill);
    }

    public List<Project> getMyProjects(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return projectRepository.findByPostedById(user.getId());
    }

    public List<AiRecommendResponse.ProjectSuggestion> suggestProjects(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        List<String> skills = user.getUserSkills().stream()
                .map(us -> us.getSkillName())
                .collect(java.util.stream.Collectors.toList());
                
        AiRecommendResponse.ProjectSuggestion[] suggestions = aiServiceClient.suggestProjects(skills);
        return java.util.Arrays.asList(suggestions);
    }
}
