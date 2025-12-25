package com.blog.dto;

import jakarta.validation.constraints.NotBlank;
import lombok.Data;

import java.util.ArrayList;
import java.util.List;

@Data
public class BlogPostRequest {
    @NotBlank
    private String title;
    
    @NotBlank
    private String content;
    
    private String authorName;
    
    private Boolean published = true;
    
    private List<String> imageUrls = new ArrayList<>();
    
    private List<String> videoUrls = new ArrayList<>();
}

