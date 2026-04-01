package com.skillsync.controller;

import com.skillsync.dto.UpdateProfileRequest;
import com.skillsync.dto.UserMetricsDto;
import com.skillsync.dto.UserProfileDto;
import com.skillsync.service.UserService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
@CrossOrigin(origins = "*")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    // GET /api/users/me — current logged-in user's profile
    @GetMapping("/me")
    public ResponseEntity<UserProfileDto> getMyProfile(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserProfile(userDetails.getUsername()));
    }

    @GetMapping("/me/metrics")
    public ResponseEntity<UserMetricsDto> getMyMetrics(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(userService.getUserMetrics(userDetails.getUsername()));
    }

    @PutMapping("/me/sudoku-points")
    public ResponseEntity<?> addSudokuPoints(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestParam int points) {
        try {
            Long userId = userService.getUserProfile(userDetails.getUsername()).getId();
            userService.incrementSudokuPoints(userId, points);
            return ResponseEntity.ok().build();
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Failed to sync points: " + e.getMessage());
        }
    }

    // PUT /api/users/me — update profile and skills
    @PutMapping("/me")
    public ResponseEntity<?> updateMyProfile(
            @AuthenticationPrincipal UserDetails userDetails,
            @RequestBody UpdateProfileRequest request) {
        try {
            UserProfileDto updated = userService.updateProfile(userDetails.getUsername(), request);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.badRequest().body("Update failed: " + e.getMessage());
        }
    }

    // GET /api/users/{id} — any user's public profile
    @GetMapping("/{id}")
    public ResponseEntity<?> getUserById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserProfileById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }

    // GET /api/users/{id}/metrics — any user's metrics
    @GetMapping("/{id}/metrics")
    public ResponseEntity<?> getUserMetricsById(@PathVariable Long id) {
        try {
            return ResponseEntity.ok(userService.getUserMetricsById(id));
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
