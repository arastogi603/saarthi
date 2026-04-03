package com.skillsync.controller;

import com.skillsync.dto.MatchResponse;
import com.skillsync.service.MatchService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/matches")
@CrossOrigin(origins = "*")
public class MatchController {

    private final MatchService matchService;

    public MatchController(MatchService matchService) {
        this.matchService = matchService;
    }

    // GET /api/matches — get my saved matches (sorted by score)
    @GetMapping
    public ResponseEntity<List<MatchResponse>> getMyMatches(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(matchService.getMyMatches(userDetails.getUsername()));
    }

    // GET /api/matches/{id} — frontend calls this right after login with the user's own ID
    // We ignore the path param and use the JWT token to identify the user securely
    @GetMapping("/{id}")
    public ResponseEntity<?> getMatchesById(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(matchService.getMyMatches(userDetails.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/matches/find — run matching engine + save results
    @PostMapping("/find")
    public ResponseEntity<?> findMatches(
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(matchService.findMatches(userDetails.getUsername()));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Matching failed: " + e.getMessage());
        }
    }

    // PUT /api/matches/{id}/accept
    @PutMapping("/{id}/accept")
    public ResponseEntity<?> acceptMatch(
            @PathVariable Long id,
            @RequestParam(required = false) String fulfilledSkill,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(matchService.updateMatchStatus(id, "ACCEPTED", userDetails.getUsername(), fulfilledSkill));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // PUT /api/matches/{id}/reject
    @PutMapping("/{id}/reject")
    public ResponseEntity<?> rejectMatch(
            @PathVariable Long id,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(matchService.updateMatchStatus(id, "REJECTED", userDetails.getUsername(), null));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    // POST /api/matches/{id}/status?status=ACCEPTED|REJECTED
    // Matches the contract in README.md
    @PostMapping("/{id}/status")
    public ResponseEntity<?> updateStatus(
            @PathVariable Long id,
            @RequestParam String status,
            @RequestParam(required = false) String fulfilledSkill,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(matchService.updateMatchStatus(id, status, userDetails.getUsername(), fulfilledSkill));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/pending")
    public ResponseEntity<List<MatchResponse>> getPendingRequests(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(matchService.getPendingRequests(userDetails.getUsername()));
    }

    // GET /api/matches/recommendations
    @GetMapping("/recommendations")
    public ResponseEntity<?> getRecommendations(
            @RequestParam(defaultValue = "1") int page,
            @RequestParam(defaultValue = "10") int limit,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(matchService.getRecommendations(userDetails.getUsername(), page, limit));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @PostMapping("/{id}/request")
    public ResponseEntity<?> requestMatch(
            @PathVariable Long id,
            @RequestParam(required = false) Long projectId,
            @RequestParam(required = false) String fulfilledSkill,
            @AuthenticationPrincipal UserDetails userDetails) {
        try {
            return ResponseEntity.ok(matchService.requestMatch(id, userDetails.getUsername(), projectId, fulfilledSkill));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }
}

