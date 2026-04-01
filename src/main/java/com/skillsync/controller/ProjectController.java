package com.skillsync.controller;

import com.skillsync.dto.ProjectRequest;
import com.skillsync.model.Project;
import com.skillsync.service.ProjectService;
import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/projects")
@CrossOrigin(origins = "*")
public class ProjectController {

    private final ProjectService projectService;

    public ProjectController(ProjectService projectService) {
        this.projectService = projectService;
    }

    // GET /api/projects — all open projects
    @GetMapping
    public ResponseEntity<List<Project>> getAllProjects() {
        return ResponseEntity.ok(projectService.getAllProjects());
    }

    // GET /api/projects/search?skill=React
    @GetMapping("/search")
    public ResponseEntity<List<Project>> search(@RequestParam("skill") String skill) {
        return ResponseEntity.ok(projectService.searchBySkill(skill));
    }

    // GET /api/projects/mine — my own posts
    @GetMapping("/mine")
    public ResponseEntity<List<Project>> getMyProjects(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(projectService.getMyProjects(userDetails.getUsername()));
    }

    // GET /api/projects/{id}
    @GetMapping("/{id}")
    public ResponseEntity<?> getProject(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(projectService.getProjectById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/projects/suggestions
    @GetMapping("/suggestions")
    public ResponseEntity<?> getProjectSuggestions(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(projectService.suggestProjects(userDetails.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/projects
    @PostMapping
    public ResponseEntity<?> createProject(
            @Valid @RequestBody ProjectRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(projectService.createProject(request, userDetails.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // DELETE /api/projects/{id}
    @DeleteMapping("/{id}")
    public ResponseEntity<?> deleteProject(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            projectService.deleteProject(id, userDetails.getUsername());
            return ResponseEntity.ok("Project deleted successfully");
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}
