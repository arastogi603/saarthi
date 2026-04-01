package com.skillsync.config;

import com.skillsync.model.*;
import com.skillsync.repository.*;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Configuration
public class DataSeeder {

    @Bean
    CommandLineRunner initDatabase(
            UserRepository userRepository,
            UserSkillRepository userSkillRepository,
            ChatRoomRepository chatRoomRepository,
            SessionRepository sessionRepository,
            PasswordEncoder passwordEncoder) {
        return args -> {
            if (userRepository.count() > 0) {
                return;
            }

            // 1. Create Users
            User astra = new User();
            astra.setName("Astra_Node");
            astra.setEmail("astra@skillsync.ai");
            astra.setPassword(passwordEncoder.encode("password"));
            astra.setBio("Neural architect looking for cluster synchronization.");
            astra.setGoal(User.Goal.STUDY_BUDDY);
            userRepository.save(astra);

            User aryan = new User();
            aryan.setName("Aryan Sharma");
            aryan.setEmail("aryan@skillsync.ai");
            aryan.setPassword(passwordEncoder.encode("password"));
            aryan.setBio("React & TypeScript Specialist.");
            aryan.setGoal(User.Goal.PROJECT_PARTNER);
            userRepository.save(aryan);

            User sarah = new User();
            sarah.setName("Sarah Chen");
            sarah.setEmail("sarah@skillsync.ai");
            sarah.setPassword(passwordEncoder.encode("password"));
            sarah.setBio("UI/UX Visionary.");
            sarah.setGoal(User.Goal.TEAM_MEMBER);
            userRepository.save(sarah);

            // 2. Add Skills
            UserSkill skill1 = new UserSkill();
            skill1.setUser(astra);
            skill1.setSkillName("AI/ML");
            skill1.setLevel(UserSkill.SkillLevel.EXPERT);
            userSkillRepository.save(skill1);

            UserSkill skill2 = new UserSkill();
            skill2.setUser(aryan);
            skill2.setSkillName("React");
            skill2.setLevel(UserSkill.SkillLevel.EXPERT);
            userSkillRepository.save(skill2);

            UserSkill skill3 = new UserSkill();
            skill3.setUser(sarah);
            skill3.setSkillName("Tailwind");
            skill3.setLevel(UserSkill.SkillLevel.INTERMEDIATE);
            userSkillRepository.save(skill3);

            // 3. Create Chat Rooms
            ChatRoom global = new ChatRoom();
            global.setName("Global Cluster");
            global.setMembers(new ArrayList<>(List.of(astra, aryan, sarah)));
            chatRoomRepository.save(global);

            ChatRoom reactSub = new ChatRoom();
            reactSub.setName("React Logic");
            reactSub.setMembers(new ArrayList<>(List.of(astra, aryan)));
            chatRoomRepository.save(reactSub);

            // 4. Create Sessions
            Session s1 = new Session();
            s1.setTitle("Advanced React Patterns");
            s1.setAuthor("Aryan Sharma");
            s1.setStartTime(LocalDateTime.now().plusHours(1));
            s1.setDuration("1h 30m");
            s1.setType("LIVE");
            s1.setAttendees(42);
            sessionRepository.save(s1);

            Session s2 = new Session();
            s2.setTitle("Neural Networks 101");
            s2.setAuthor("Astra_Node");
            s2.setStartTime(LocalDateTime.now().minusMinutes(30)); // Live
            s2.setDuration("2h");
            s2.setType("WORKSHOP");
            s2.setAttendees(120);
            sessionRepository.save(s2);

            System.out.println("Neural Database Seeded Successfully.");
        };
    }
}
