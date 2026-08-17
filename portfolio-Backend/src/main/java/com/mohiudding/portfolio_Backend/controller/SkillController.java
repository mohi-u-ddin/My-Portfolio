package com.mohiudding.portfolio_Backend.controller;

import com.mohiudding.portfolio_Backend.dto.SkillDto;
import com.mohiudding.portfolio_Backend.model.Skill;
import com.mohiudding.portfolio_Backend.service.SkillService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/skills")
@RequiredArgsConstructor
public class SkillController {

    private final SkillService skillService;

    /**
     * Fetch all skills (used by both Portfolio & CMS)
     * GET /api/skills
     */
    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }

    /**
     * Fetch a single skill by ID
     * GET /api/skills/{id}
     */
    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long id) {
        Skill skill = skillService.getSkillById(id);
        return ResponseEntity.ok(skill);
    }

    /**
     * Filter skills by category (e.g., Backend, Frontend, Database, Tools)
     * GET /api/skills/category/{category}
     */
    @GetMapping("/category/{category}")
    public ResponseEntity<List<Skill>> getSkillsByCategory(@PathVariable String category) {
        List<Skill> skills = skillService.getSkillsByCategory(category);
        return ResponseEntity.ok(skills);
    }

    /**
     * Create a new skill
     * POST /api/skills
     */
    @PostMapping
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody SkillDto skillDto) {
        Skill createdSkill = skillService.createSkill(skillDto);
        return new ResponseEntity<>(createdSkill, HttpStatus.CREATED);
    }

    /**
     * Update an existing skill
     * PUT /api/skills/{id}
     */
    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody SkillDto skillDto
    ) {
        Skill updatedSkill = skillService.updateSkill(id, skillDto);
        return ResponseEntity.ok(updatedSkill);
    }

    /**
     * Delete a skill by ID
     * DELETE /api/skills/{id}
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
