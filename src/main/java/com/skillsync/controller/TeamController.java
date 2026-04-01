package com.skillsync.controller;

import com.skillsync.dto.ai.AiTeamMember;
import com.skillsync.service.TeamService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/teams")
@CrossOrigin(origins = "*", maxAge = 3600)
public class TeamController {

    private final TeamService teamService;

    public TeamController(TeamService teamService) {
        this.teamService = teamService;
    }

    @GetMapping("/build")
    public ResponseEntity<AiTeamMember[]> buildTeam(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam(defaultValue = "5") int size) {
        return ResponseEntity.ok(teamService.buildTeamForUser(userDetails.getUsername(), size));
    }
}
