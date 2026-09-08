package com.mozhi.learn.model;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "translation_memory")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TranslationMemory {

    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private UUID id;

    @Column(name = "source_language_id")
    private UUID sourceLanguageId;

    @Column(name = "target_language_id")
    private UUID targetLanguageId;

    @Column(name = "source_text_normalized", nullable = false, columnDefinition = "TEXT")
    private String sourceTextNormalized;

    @Column(name = "translated_text", nullable = false, columnDefinition = "TEXT")
    private String translatedText;

    @Column(name = "context_grade")
    private Integer contextGrade;

    @Column(name = "context_subject", length = 100)
    private String contextSubject;

    @Column(name = "context_topic", length = 100)
    private String contextTopic;

    @Column(name = "source_type", length = 50)
    private String sourceType;

    @Column(name = "verification_status", length = 50)
    private String verificationStatus;

    @Column(name = "approved_by")
    private UUID approvedBy;

    @Column(name = "approved_at")
    private LocalDateTime approvedAt;

    @Column(name = "usage_count")
    private Integer usageCount;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.usageCount == null) this.usageCount = 0;
        if (this.verificationStatus == null) this.verificationStatus = "DRAFT";
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }
}
