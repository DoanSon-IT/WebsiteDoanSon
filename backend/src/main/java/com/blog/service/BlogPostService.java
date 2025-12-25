package com.blog.service;

import com.blog.dto.BlogPostRequest;
import com.blog.dto.BlogPostResponse;
import com.blog.entity.BlogPost;
import com.blog.repository.BlogPostRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class BlogPostService {
    
    @Autowired
    private BlogPostRepository blogPostRepository;
    
    public List<BlogPostResponse> getAllPublishedPosts() {
        return blogPostRepository.findByPublishedTrueOrderByCreatedAtDesc()
                .stream()
                .map(BlogPostResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    public List<BlogPostResponse> getAllPosts() {
        return blogPostRepository.findAllByOrderByCreatedAtDesc()
                .stream()
                .map(BlogPostResponse::fromEntity)
                .collect(Collectors.toList());
    }
    
    public BlogPostResponse getPostById(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        return BlogPostResponse.fromEntity(post);
    }
    
    @Transactional
    public BlogPostResponse createPost(BlogPostRequest request) {
        BlogPost post = new BlogPost();
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthorName(request.getAuthorName());
        post.setPublished(request.getPublished());
        post.setImageUrls(request.getImageUrls());
        post.setVideoUrls(request.getVideoUrls());
        
        BlogPost savedPost = blogPostRepository.save(post);
        return BlogPostResponse.fromEntity(savedPost);
    }
    
    @Transactional
    public BlogPostResponse updatePost(Long id, BlogPostRequest request) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        
        post.setTitle(request.getTitle());
        post.setContent(request.getContent());
        post.setAuthorName(request.getAuthorName());
        post.setPublished(request.getPublished());
        post.setImageUrls(request.getImageUrls());
        post.setVideoUrls(request.getVideoUrls());
        
        BlogPost updatedPost = blogPostRepository.save(post);
        return BlogPostResponse.fromEntity(updatedPost);
    }
    
    @Transactional
    public void deletePost(Long id) {
        BlogPost post = blogPostRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Blog post not found with id: " + id));
        blogPostRepository.delete(post);
    }
}

