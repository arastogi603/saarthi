package com.skillsync.repository;

import com.skillsync.model.UserSkill;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

public interface UserSkillRepository extends JpaRepository<UserSkill, Long> {
    List<UserSkill> findByUserId(Long userId);

    @Modifying
    @Transactional
    @Query("DELETE FROM UserSkill us WHERE us.user.id = :userId")
    void deleteByUserId(@Param("userId") Long userId);
}
