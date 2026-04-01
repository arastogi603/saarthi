package com.skillsync.repository;

import com.skillsync.model.Project;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface ProjectRepository extends JpaRepository<Project, Long> {
    List<Project> findByPostedById(Long userId);
    List<Project> findByStatus(Project.ProjectStatus status);

    @Query("SELECT DISTINCT p FROM Project p JOIN p.requiredSkills s WHERE LOWER(s) LIKE LOWER(CONCAT('%', :skill, '%'))")
    List<Project> searchBySkill(@Param("skill") String skill);
}
