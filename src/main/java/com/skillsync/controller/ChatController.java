package com.skillsync.controller;

import com.skillsync.dto.ChatMessageDto;
import com.skillsync.model.ChatRoom;
import com.skillsync.service.ChatService;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/chat")
@CrossOrigin(origins = "*")
public class ChatController {

    private final ChatService chatService;
    private final SimpMessagingTemplate messagingTemplate;

    public ChatController(ChatService chatService, SimpMessagingTemplate messagingTemplate) {
        this.chatService = chatService;
        this.messagingTemplate = messagingTemplate;
    }

    @GetMapping("/rooms")
    public ResponseEntity<List<ChatRoom>> getMyRooms(
            @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getMyRooms(userDetails.getUsername()));
    }

    @PostMapping("/rooms")
    public ResponseEntity<?> createRoom(
            @RequestBody Map<String, Object> body) {
        try {
            String name = (String) body.get("name");
            @SuppressWarnings("unchecked")
            List<Integer> rawIds = (List<Integer>) body.get("memberIds");
            List<Long> memberIds = rawIds.stream().map(Long::valueOf).toList();
            return ResponseEntity.ok(chatService.createRoom(name, memberIds));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(e.getMessage());
        }
    }

    @GetMapping("/rooms/{roomId}/messages")
    public ResponseEntity<List<ChatMessageDto>> getMessages(@PathVariable Long roomId) {
        return ResponseEntity.ok(chatService.getMessages(roomId));
    }

    @MessageMapping("/chat.send")
    public void sendMessage(@Payload ChatMessageDto dto) {
        ChatMessageDto saved = chatService.saveAndBroadcast(dto);
        messagingTemplate.convertAndSend("/topic/room/" + dto.getRoomId(), saved);
    }

    @PostMapping("/rooms/private/{targetUserId}")
    public ResponseEntity<ChatRoom> createPrivateRoom(@PathVariable Long targetUserId, 
                                                      @AuthenticationPrincipal UserDetails userDetails) {
        return ResponseEntity.ok(chatService.getOrCreatePrivateRoom(userDetails.getUsername(), targetUserId));
    }
}
