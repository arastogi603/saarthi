package com.skillsync.service;

import com.skillsync.dto.ChatMessageDto;
import com.skillsync.model.ChatMessage;
import com.skillsync.model.ChatRoom;
import com.skillsync.model.User;
import com.skillsync.repository.ChatMessageRepository;
import com.skillsync.repository.ChatRoomRepository;
import com.skillsync.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class ChatService {

    private final ChatRoomRepository chatRoomRepository;
    private final ChatMessageRepository chatMessageRepository;
    private final UserRepository userRepository;

    public ChatService(ChatRoomRepository chatRoomRepository, ChatMessageRepository chatMessageRepository, UserRepository userRepository) {
        this.chatRoomRepository = chatRoomRepository;
        this.chatMessageRepository = chatMessageRepository;
        this.userRepository = userRepository;
    }

    @Transactional
    public ChatRoom createRoom(String name, List<Long> memberIds) {
        List<User> members = userRepository.findAllById(memberIds);
        ChatRoom room = new ChatRoom();
        room.setName(name);
        room.setMembers(members);
        return chatRoomRepository.save(room);
    }

    @Transactional
    public void addMemberToRoom(Long roomId, Long userId) {
        ChatRoom room = chatRoomRepository.findById(roomId)
                .orElseThrow(() -> new RuntimeException("Room not found"));
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        if (!room.getMembers().contains(user)) {
            room.getMembers().add(user);
            chatRoomRepository.save(room);
        }
    }

    @Transactional
    public ChatRoom getOrCreatePrivateRoom(String email1, Long userId2) {
        User u1 = userRepository.findByEmail(email1).orElseThrow();
        Long userId1 = u1.getId();
        // Try to find an existing room with exactly these two members
        List<ChatRoom> rooms = chatRoomRepository.findRoomsByUserId(userId1);
        for (ChatRoom room : rooms) {
            List<User> members = room.getMembers();
            if (members.size() == 2) {
                boolean has2 = false;
                for (User m : members) {
                    if (m.getId().equals(userId2)) has2 = true;
                }
                if (has2) return room;
            }
        }

        // Create new
        User u2 = userRepository.findById(userId2).orElseThrow();
        
        ChatRoom newRoom = new ChatRoom();
        newRoom.setName("Direct Link: " + u1.getName() + " & " + u2.getName());
        newRoom.setMembers(new ArrayList<>(List.of(u1, u2)));
        return chatRoomRepository.save(newRoom);
    }

    public List<ChatRoom> getMyRooms(String email) {
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("User not found"));
        return chatRoomRepository.findRoomsByUserId(user.getId());
    }

    public List<ChatMessageDto> getMessages(Long roomId) {
        return chatMessageRepository.findByRoomIdOrderBySentAtAsc(roomId)
                .stream()
                .map(this::toDto)
                .collect(Collectors.toList());
    }

    @Transactional
    public ChatMessageDto saveAndBroadcast(ChatMessageDto dto) {
        ChatRoom room = chatRoomRepository.findById(dto.getRoomId())
                .orElseThrow(() -> new RuntimeException("Room not found"));
        User sender = userRepository.findById(dto.getSenderId())
                .orElseThrow(() -> new RuntimeException("Sender not found"));

        ChatMessage message = ChatMessage.builder()
                .room(room)
                .sender(sender)
                .content(dto.getContent())
                .messageType(ChatMessage.MessageType.valueOf(
                        dto.getMessageType() != null ? dto.getMessageType() : "CHAT"))
                .build();

        message = chatMessageRepository.save(message);
        return toDto(message);
    }

    private ChatMessageDto toDto(ChatMessage msg) {
        return ChatMessageDto.builder()
                .roomId(msg.getRoom().getId())
                .senderId(msg.getSender().getId())
                .senderName(msg.getSender().getName())
                .content(msg.getContent())
                .messageType(msg.getMessageType().name())
                .sentAt(msg.getSentAt().toString())
                .build();
    }
}
