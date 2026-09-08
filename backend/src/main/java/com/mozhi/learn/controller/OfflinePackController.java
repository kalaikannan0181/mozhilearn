package com.mozhi.learn.controller;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/offline-packs")
@CrossOrigin(origins = "*")
public class OfflinePackController {

    @GetMapping("/manifest")
    public ResponseEntity<Map<String, Object>> getManifest(
            @RequestParam(defaultValue = "1") Integer grade,
            @RequestParam(defaultValue = "sat") String languageCode) {
        
        Map<String, Object> manifest = Map.of(
            "language", languageCode,
            "grade", grade,
            "version", "1.0.0-prototype",
            "status", "Offline learning pack — planned prototype module",
            "modules", List.of("lesson_text", "story_mode", "flashcards", "activities", "quizzes"),
            "offlineAvailable", true
        );
        
        return ResponseEntity.ok(manifest);
    }
}
