package com.skillsync.model;

import jakarta.persistence.*;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "chat_rooms")
public class ChatRoom {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    @ManyToMany(fetch = FetchType.EAGER)
    @JoinTable(
        name = "chat_room_members",
        joinColumns = @JoinColumn(name = "room_id"),
        inverseJoinColumns = @JoinColumn(name = "user_id")
    )
    private List<User> members = new ArrayList<>();

    public ChatRoom() {}

    public ChatRoom(Long id, String name, List<User> members) {
        this.id = id;
        this.name = name;
        this.members = members != null ? members : new ArrayList<>();
    }

    public static ChatRoomBuilder builder() {
        return new ChatRoomBuilder();
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    public List<User> getMembers() { return members; }
    public void setMembers(List<User> members) { this.members = members; }

    public static class ChatRoomBuilder {
        private Long id;
        private String name;
        private List<User> members;

        public ChatRoomBuilder id(Long id) { this.id = id; return this; }
        public ChatRoomBuilder name(String name) { this.name = name; return this; }
        public ChatRoomBuilder members(List<User> members) { this.members = members; return this; }
        public ChatRoom build() {
            return new ChatRoom(id, name, members);
        }
    }
}
