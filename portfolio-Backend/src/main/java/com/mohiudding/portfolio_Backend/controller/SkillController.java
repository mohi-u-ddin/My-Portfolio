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
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:3000"})
public class SkillController {

    private final SkillService skillService;

    @GetMapping
    public ResponseEntity<List<Skill>> getAllSkills() {
        List<Skill> skills = skillService.getAllSkills();
        return ResponseEntity.ok(skills);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Skill> getSkillById(@PathVariable Long id) {
        Skill skill = skillService.getSkillById(id);
        return ResponseEntity.ok(skill);
    }

    @GetMapping("/category/{category}")
    public ResponseEntity<List<Skill>> getSkillsByCategory(@PathVariable String category) {
        List<Skill> skills = skillService.getSkillsByCategory(category);
        return ResponseEntity.ok(skills);
    }

    @PostMapping
    public ResponseEntity<Skill> createSkill(@Valid @RequestBody SkillDto skillDto) {
        Skill createdSkill = skillService.createSkill(skillDto);
        return new ResponseEntity<>(createdSkill, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Skill> updateSkill(
            @PathVariable Long id,
            @Valid @RequestBody SkillDto skillDto
    ) {
        Skill updatedSkill = skillService.updateSkill(id, skillDto);
        return ResponseEntity.ok(updatedSkill);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteSkill(@PathVariable Long id) {
        skillService.deleteSkill(id);
        return ResponseEntity.noContent().build();
    }
}
