package com.skillsync.controller;

import com.skillsync.model.Session;
import com.skillsync.repository.SessionRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/sessions")
@CrossOrigin(origins = "*")
public class SessionController {

    private final SessionRepository sessionRepository;

    public SessionController(SessionRepository sessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    @GetMapping
    public ResponseEntity<List<Session>> getAllSessions(@RequestParam(required = false) String category) {
        if (category != null && !category.isEmpty()) {
            return ResponseEntity.ok(sessionRepository.findByCategory(category));
        }
        return ResponseEntity.ok(sessionRepository.findAll());
    }

    @PostMapping("/{id}/join")
    public ResponseEntity<?> joinSession(@PathVariable Long id) {
        Session session = sessionRepository.findById(id).orElseThrow(() -> new RuntimeException("Session not found"));
        session.setAttendees(session.getAttendees() + 1);
        sessionRepository.save(session);
        return ResponseEntity.ok("Successfully joined session: " + session.getTitle());
    }
}
