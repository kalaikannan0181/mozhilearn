package com.mozhi.learn.repository;

import com.mozhi.learn.model.TranslationMemory;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.UUID;

@Repository
public interface TranslationMemoryRepository extends JpaRepository<TranslationMemory, UUID> {
    List<TranslationMemory> findBySourceLanguageIdAndTargetLanguageId(UUID sourceLanguageId, UUID targetLanguageId);
}
