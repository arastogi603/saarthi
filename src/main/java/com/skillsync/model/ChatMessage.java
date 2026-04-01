package com.skillsync.model;

import jakarta.persistence.*;
import org.hibernate.annotations.CreationTimestamp;
import java.time.LocalDateTime;

@Entity
@Table(name = "chat_messages")
public class ChatMessage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "room_id", nullable = false)
    private ChatRoom room;

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "sender_id", nullable = false)
    private User sender;

    @Column(nullable = false, length = 1000)
    private String content;

    @Enumerated(EnumType.STRING)
    private MessageType messageType = MessageType.CHAT;

    @CreationTimestamp
    private LocalDateTime sentAt;

    public ChatMessage() {}

    public ChatMessage(Long id, ChatRoom room, User sender, String content, MessageType messageType, LocalDateTime sentAt) {
        this.id = id;
        this.room = room;
        this.sender = sender;
        this.content = content;
        this.messageType = messageType != null ? messageType : MessageType.CHAT;
        this.sentAt = sentAt;
    }

    public static ChatMessageBuilder builder() {
        return new ChatMessageBuilder();
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public ChatRoom getRoom() { return room; }
    public void setRoom(ChatRoom room) { this.room = room; }
    public User getSender() { return sender; }
    public void setSender(User sender) { this.sender = sender; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public MessageType getMessageType() { return messageType; }
    public void setMessageType(MessageType messageType) { this.messageType = messageType; }
    public LocalDateTime getSentAt() { return sentAt; }
    public void setSentAt(LocalDateTime sentAt) { this.sentAt = sentAt; }

    public enum MessageType {
        CHAT, JOIN, LEAVE
    }

    public static class ChatMessageBuilder {
        private Long id;
        private ChatRoom room;
        private User sender;
        private String content;
        private MessageType messageType;
        private LocalDateTime sentAt;

        public ChatMessageBuilder id(Long id) { this.id = id; return this; }
        public ChatMessageBuilder room(ChatRoom room) { this.room = room; return this; }
        public ChatMessageBuilder sender(User sender) { this.sender = sender; return this; }
        public ChatMessageBuilder content(String content) { this.content = content; return this; }
        public ChatMessageBuilder messageType(MessageType messageType) { this.messageType = messageType; return this; }
        public ChatMessageBuilder sentAt(LocalDateTime sentAt) { this.sentAt = sentAt; return this; }
        public ChatMessage build() {
            return new ChatMessage(id, room, sender, content, messageType, sentAt);
        }
    }
}
