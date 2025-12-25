package com.blog.dto;

import com.blog.entity.BlogPost;
import lombok.Data;

import java.time.LocalDateTime;
import java.util.List;

@Data
public class BlogPostResponse {
    private Long id;
    private String title;
    private String content;
    private String authorName;
    private Boolean published;
    private List<String> imageUrls;
    private List<String> videoUrls;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    
    public static BlogPostResponse fromEntity(BlogPost post) {
        BlogPostResponse response = new BlogPostResponse();
        response.setId(post.getId());
        response.setTitle(post.getTitle());
        response.setContent(post.getContent());
        response.setAuthorName(post.getAuthorName());
        response.setPublished(post.getPublished());
        response.setImageUrls(post.getImageUrls());
        response.setVideoUrls(post.getVideoUrls());
        response.setCreatedAt(post.getCreatedAt());
        response.setUpdatedAt(post.getUpdatedAt());
        return response;
    }
}

