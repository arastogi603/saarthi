package com.skillsync.service;

import com.skillsync.dto.ProjectRequest;
import com.skillsync.model.Project;
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

    public ProjectService(ProjectRepository projectRepository, 
                          UserRepository userRepository, 
                          AiServiceClient aiServiceClient) {
        this.projectRepository = projectRepository;
        this.userRepository = userRepository;
        this.aiServiceClient = aiServiceClient;
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

        Project project = Project.builder()
                .title(request.getTitle())
                .description(request.getDescription())
                .requiredSkills(request.getRequiredSkills())
                .postedBy(user)
                .build();

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
