package com.albaro.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "face_embeddings")
public class FaceEmbedding {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "id", columnDefinition = "INT UNSIGNED")
    private Long id;

    @Column(name = "user_id", nullable = false)
    private String userId;

    @Lob
    @Column(nullable = false)
    private byte[] embedding;

    public FaceEmbedding() {
    }

    public FaceEmbedding(Long id, String userId, byte[] embedding) {
        this.id = id;
        this.userId = userId;
        this.embedding = embedding;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getUserId() {
        return userId;
    }

    public void setUserId(String userId) {
        this.userId = userId;
    }

    public byte[] getEmbedding() {
        return embedding;
    }

    public void setEmbedding(byte[] embedding) {
        this.embedding = embedding;
    }
}