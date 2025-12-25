# Personal Blog API Documentation

## Base URL
```
http://localhost:8080/api
```

## Authentication

The API uses JWT (JSON Web Token) for authentication. Protected endpoints require a valid JWT token in the Authorization header.

### Headers for Protected Endpoints
```
Authorization: Bearer <your-jwt-token>
```

---

## Authentication Endpoints

### Login
Authenticate admin user and receive JWT token.

**Endpoint:** `POST /auth/login`

**Request Body:**
```json
{
  "username": "admin",
  "password": "admin123"
}
```

**Response:** `200 OK`
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "type": "Bearer",
  "username": "admin"
}
```

**Error Response:** `401 Unauthorized`
```json
{
  "message": "Invalid username or password"
}
```

---

## Public Blog Endpoints

### Get All Published Posts
Retrieve all published blog posts.

**Endpoint:** `GET /public/posts`

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "My First Blog Post",
    "content": "This is the content of my first blog post...",
    "authorName": "John Doe",
    "published": true,
    "imageUrls": [
      "https://res.cloudinary.com/xxx/image/upload/v123/blog/images/abc.jpg"
    ],
    "videoUrls": [
      "https://res.cloudinary.com/xxx/video/upload/v123/blog/videos/xyz.mp4"
    ],
    "createdAt": "2024-01-15T10:30:00",
    "updatedAt": "2024-01-15T10:30:00"
  }
]
```

### Get Post by ID
Retrieve a specific blog post by ID.

**Endpoint:** `GET /public/posts/{id}`

**Parameters:**
- `id` (path parameter): Post ID

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "My First Blog Post",
  "content": "This is the content of my first blog post...",
  "authorName": "John Doe",
  "published": true,
  "imageUrls": ["https://..."],
  "videoUrls": ["https://..."],
  "createdAt": "2024-01-15T10:30:00",
  "updatedAt": "2024-01-15T10:30:00"
}
```

**Error Response:** `404 Not Found`
```json
{
  "message": "Blog post not found with id: 1"
}
```

---

## Admin Blog Endpoints (Protected)

All admin endpoints require JWT authentication.

### Get All Posts (Including Drafts)
Retrieve all blog posts including unpublished drafts.

**Endpoint:** `GET /admin/posts`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK`
```json
[
  {
    "id": 1,
    "title": "Published Post",
    "content": "...",
    "published": true,
    ...
  },
  {
    "id": 2,
    "title": "Draft Post",
    "content": "...",
    "published": false,
    ...
  }
]
```

### Get Post by ID (Admin)
Retrieve a specific post (including drafts).

**Endpoint:** `GET /admin/posts/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `200 OK` (same structure as public endpoint)

### Create New Post
Create a new blog post.

**Endpoint:** `POST /admin/posts`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "New Blog Post",
  "content": "This is the content of the new post...",
  "authorName": "John Doe",
  "published": true,
  "imageUrls": [
    "https://res.cloudinary.com/xxx/image/upload/v123/blog/images/abc.jpg"
  ],
  "videoUrls": [
    "https://res.cloudinary.com/xxx/video/upload/v123/blog/videos/xyz.mp4"
  ]
}
```

**Response:** `201 Created`
```json
{
  "id": 3,
  "title": "New Blog Post",
  "content": "This is the content of the new post...",
  "authorName": "John Doe",
  "published": true,
  "imageUrls": [...],
  "videoUrls": [...],
  "createdAt": "2024-01-15T11:00:00",
  "updatedAt": "2024-01-15T11:00:00"
}
```

### Update Post
Update an existing blog post.

**Endpoint:** `PUT /admin/posts/{id}`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: application/json
```

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "authorName": "John Doe",
  "published": true,
  "imageUrls": [...],
  "videoUrls": [...]
}
```

**Response:** `200 OK`
```json
{
  "id": 1,
  "title": "Updated Title",
  ...
}
```

### Delete Post
Delete a blog post.

**Endpoint:** `DELETE /admin/posts/{id}`

**Headers:**
```
Authorization: Bearer <token>
```

**Response:** `204 No Content`

**Error Response:** `404 Not Found`

---

## Media Upload Endpoints (Protected)

### Upload Single Image
Upload an image to Cloudinary.

**Endpoint:** `POST /admin/posts/upload/image`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <image-file>
```

**Response:** `200 OK`
```
https://res.cloudinary.com/xxx/image/upload/v123/blog/images/abc.jpg
```

### Upload Single Video
Upload a video to Cloudinary.

**Endpoint:** `POST /admin/posts/upload/video`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
file: <video-file>
```

**Response:** `200 OK`
```
https://res.cloudinary.com/xxx/video/upload/v123/blog/videos/xyz.mp4
```

### Upload Multiple Images
Upload multiple images at once.

**Endpoint:** `POST /admin/posts/upload/images`

**Headers:**
```
Authorization: Bearer <token>
Content-Type: multipart/form-data
```

**Request Body:**
```
files: <image-file-1>
files: <image-file-2>
files: <image-file-3>
```

**Response:** `200 OK`
```json
[
  "https://res.cloudinary.com/xxx/image/upload/v123/blog/images/abc1.jpg",
  "https://res.cloudinary.com/xxx/image/upload/v123/blog/images/abc2.jpg",
  "https://res.cloudinary.com/xxx/image/upload/v123/blog/images/abc3.jpg"
]
```

---

## Error Responses

### 401 Unauthorized
```json
{
  "message": "Unauthorized",
  "status": 401
}
```

### 403 Forbidden
```json
{
  "message": "Access Denied",
  "status": 403
}
```

### 404 Not Found
```json
{
  "message": "Resource not found",
  "status": 404
}
```

### 500 Internal Server Error
```json
{
  "message": "Internal server error",
  "status": 500
}
```

---

## Example Usage with cURL

### Login
```bash
curl -X POST http://localhost:8080/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username":"admin","password":"admin123"}'
```

### Get All Public Posts
```bash
curl http://localhost:8080/api/public/posts
```

### Create Post (with token)
```bash
curl -X POST http://localhost:8080/api/admin/posts \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -H "Content-Type: application/json" \
  -d '{
    "title": "Test Post",
    "content": "Test content",
    "authorName": "Admin",
    "published": true,
    "imageUrls": [],
    "videoUrls": []
  }'
```

### Upload Image
```bash
curl -X POST http://localhost:8080/api/admin/posts/upload/image \
  -H "Authorization: Bearer YOUR_TOKEN_HERE" \
  -F "file=@/path/to/image.jpg"
```

---

## Rate Limiting

Currently, there is no rate limiting implemented. Consider adding rate limiting for production use.

## CORS

CORS is configured to allow requests from `http://localhost:5173` (frontend development server).

For production, update the CORS configuration in `SecurityConfig.java`.

