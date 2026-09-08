package com.mozhi.learn.controller;

import com.mozhi.learn.model.TranslationMemory;
import com.mozhi.learn.repository.TranslationMemoryRepository;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.UUID;

@RestController
@RequestMapping("/api/translation-memory")
@CrossOrigin(origins = "*")
public class TranslationMemoryController {

    private final TranslationMemoryRepository translationMemoryRepository;

    public TranslationMemoryController(TranslationMemoryRepository translationMemoryRepository) {
        this.translationMemoryRepository = translationMemoryRepository;
    }

    @GetMapping("/search")
    public ResponseEntity<List<TranslationMemory>> search(
            @RequestParam UUID sourceLanguageId,
            @RequestParam UUID targetLanguageId) {
        List<TranslationMemory> results = translationMemoryRepository
                .findBySourceLanguageIdAndTargetLanguageId(sourceLanguageId, targetLanguageId);
        return ResponseEntity.ok(results);
    }

    @PostMapping
    public ResponseEntity<TranslationMemory> createEntry(@RequestBody TranslationMemory entry) {
        TranslationMemory saved = translationMemoryRepository.save(entry);
        return ResponseEntity.ok(saved);
    }
}
