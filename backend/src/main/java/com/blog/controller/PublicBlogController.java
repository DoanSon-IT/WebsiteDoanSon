package com.blog.controller;

import com.blog.dto.BlogPostResponse;
import com.blog.service.BlogPostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/public/posts")
public class PublicBlogController {
    
    @Autowired
    private BlogPostService blogPostService;
    
    @GetMapping
    public ResponseEntity<List<BlogPostResponse>> getAllPublishedPosts() {
        return ResponseEntity.ok(blogPostService.getAllPublishedPosts());
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<BlogPostResponse> getPostById(@PathVariable Long id) {
        return ResponseEntity.ok(blogPostService.getPostById(id));
    }
}

