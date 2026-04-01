package com.skillsync.dto;

public class ChatMessageDto {
    private Long roomId;
    private Long senderId;
    private String senderName;
    private String content;
    private String messageType; // CHAT, JOIN, LEAVE
    private String sentAt;

    public ChatMessageDto() {}

    public ChatMessageDto(Long roomId, Long senderId, String senderName, String content, String messageType, String sentAt) {
        this.roomId = roomId;
        this.senderId = senderId;
        this.senderName = senderName;
        this.content = content;
        this.messageType = messageType;
        this.sentAt = sentAt;
    }

    public static ChatMessageDtoBuilder builder() {
        return new ChatMessageDtoBuilder();
    }

    // Getters and Setters
    public Long getRoomId() { return roomId; }
    public void setRoomId(Long roomId) { this.roomId = roomId; }
    public Long getSenderId() { return senderId; }
    public void setSenderId(Long senderId) { this.senderId = senderId; }
    public String getSenderName() { return senderName; }
    public void setSenderName(String senderName) { this.senderName = senderName; }
    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }
    public String getMessageType() { return messageType; }
    public void setMessageType(String messageType) { this.messageType = messageType; }
    public String getSentAt() { return sentAt; }
    public void setSentAt(String sentAt) { this.sentAt = sentAt; }

    public static class ChatMessageDtoBuilder {
        private Long roomId;
        private Long senderId;
        private String senderName;
        private String content;
        private String messageType;
        private String sentAt;

        public ChatMessageDtoBuilder roomId(Long roomId) { this.roomId = roomId; return this; }
        public ChatMessageDtoBuilder senderId(Long senderId) { this.senderId = senderId; return this; }
        public ChatMessageDtoBuilder senderName(String senderName) { this.senderName = senderName; return this; }
        public ChatMessageDtoBuilder content(String content) { this.content = content; return this; }
        public ChatMessageDtoBuilder messageType(String messageType) { this.messageType = messageType; return this; }
        public ChatMessageDtoBuilder sentAt(String sentAt) { this.sentAt = sentAt; return this; }
        public ChatMessageDto build() {
            return new ChatMessageDto(roomId, senderId, senderName, content, messageType, sentAt);
        }
    }
}
