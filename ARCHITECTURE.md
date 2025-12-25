# Personal Blog - Architecture Overview

## System Architecture

```
┌─────────────────────────────────────────────────────────────────┐
│                         CLIENT LAYER                             │
│                                                                   │
│  ┌──────────────────┐              ┌──────────────────┐         │
│  │  Public Pages    │              │  Admin Pages     │         │
│  │  - Home          │              │  - Login         │         │
│  │  - Post Detail   │              │  - Dashboard     │         │
│  │                  │              │  - Create Post   │         │
│  │  (No Auth)       │              │  - Edit Post     │         │
│  └──────────────────┘              └──────────────────┘         │
│           │                                  │                   │
│           └──────────────┬───────────────────┘                   │
│                          │                                       │
│                   React Router                                   │
│                          │                                       │
└──────────────────────────┼───────────────────────────────────────┘
                           │
                    Axios HTTP Client
                           │
┌──────────────────────────┼───────────────────────────────────────┐
│                          │         API LAYER                      │
│                          ▼                                        │
│              ┌─────────────────────┐                             │
│              │   Spring Security   │                             │
│              │   + JWT Filter      │                             │
│              └─────────────────────┘                             │
│                          │                                        │
│         ┌────────────────┼────────────────┐                      │
│         │                │                │                      │
│         ▼                ▼                ▼                      │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   Auth    │  │   Public     │  │    Admin     │             │
│  │Controller │  │  Controller  │  │  Controller  │             │
│  │           │  │              │  │              │             │
│  │ /auth/**  │  │ /public/**   │  │ /admin/**    │             │
│  └───────────┘  └──────────────┘  └──────────────┘             │
│         │                │                │                      │
└─────────┼────────────────┼────────────────┼──────────────────────┘
          │                │                │
┌─────────┼────────────────┼────────────────┼──────────────────────┐
│         │      SERVICE LAYER              │                      │
│         │                │                │                      │
│         ▼                ▼                ▼                      │
│  ┌───────────┐  ┌──────────────┐  ┌──────────────┐             │
│  │   JWT     │  │  BlogPost    │  │  Cloudinary  │             │
│  │  Service  │  │   Service    │  │   Service    │             │
│  └───────────┘  └──────────────┘  └──────────────┘             │
│         │                │                │                      │
└─────────┼────────────────┼────────────────┼──────────────────────┘
          │                │                │
          │                │                └──────────────┐
          │                │                               │
┌─────────┼────────────────┼───────────────────────────────┼───────┐
│         │   DATA LAYER   │                               │       │
│         │                │                               │       │
│         ▼                ▼                               ▼       │
│  ┌───────────┐  ┌──────────────┐              ┌──────────────┐ │
│  │   User    │  │  BlogPost    │              │  Cloudinary  │ │
│  │Repository │  │ Repository   │              │     API      │ │
│  └───────────┘  └──────────────┘              └──────────────┘ │
│         │                │                               │       │
└─────────┼────────────────┼───────────────────────────────┼───────┘
          │                │                               │
          ▼                ▼                               ▼
    ┌─────────┐      ┌─────────┐                  ┌──────────────┐
    │  MySQL  │      │  MySQL  │                  │  Cloudinary  │
    │  users  │      │  posts  │                  │Cloud Storage │
    └─────────┘      └─────────┘                  └──────────────┘
```

## Technology Stack Details

### Frontend (React + Vite)
- **React 18**: UI library
- **React Router v6**: Client-side routing
- **Axios**: HTTP client for API calls
- **TailwindCSS**: Utility-first CSS framework
- **Vite**: Fast build tool and dev server

### Backend (Spring Boot)
- **Spring Boot 3.2**: Application framework
- **Spring Security**: Authentication & authorization
- **Spring Data JPA**: Database ORM
- **JWT (JJWT)**: Token-based authentication
- **MySQL Connector**: Database driver
- **Cloudinary SDK**: Media upload service

### Database (MySQL)
- **Tables**:
  - `users`: Admin user accounts
  - `blog_posts`: Blog post content
  - `blog_post_images`: Image URLs (one-to-many)
  - `blog_post_videos`: Video URLs (one-to-many)

### External Services
- **Cloudinary**: Cloud-based media storage and CDN

## Security Architecture

### Authentication Flow

```
1. Admin Login Request
   ↓
2. Spring Security validates credentials
   ↓
3. JWT Token generated and returned
   ↓
4. Client stores token in localStorage
   ↓
5. Subsequent requests include token in Authorization header
   ↓
6. JwtAuthenticationFilter validates token
   ↓
7. Request proceeds to controller if valid
```

### Route Protection

**Public Routes (No Auth Required):**
- `GET /api/public/posts` - View all published posts
- `GET /api/public/posts/{id}` - View single post
- `POST /api/auth/login` - Admin login

**Protected Routes (JWT Required):**
- `GET /api/admin/posts` - View all posts (including drafts)
- `POST /api/admin/posts` - Create post
- `PUT /api/admin/posts/{id}` - Update post
- `DELETE /api/admin/posts/{id}` - Delete post
- `POST /api/admin/posts/upload/*` - Upload media

## Data Flow

### Creating a Blog Post

```
1. Admin fills form in CreatePost.jsx
   ↓
2. User selects images/videos
   ↓
3. Frontend uploads media to Cloudinary via API
   ↓
4. Cloudinary returns URLs
   ↓
5. Frontend sends post data with URLs to backend
   ↓
6. Backend validates and saves to MySQL
   ↓
7. Response sent back to frontend
   ↓
8. Redirect to dashboard
```

### Viewing Blog Posts (Public)

```
1. User visits homepage
   ↓
2. Frontend calls GET /api/public/posts
   ↓
3. Backend queries MySQL for published posts
   ↓
4. Posts returned with Cloudinary URLs
   ↓
5. Frontend renders posts
   ↓
6. Images/videos loaded from Cloudinary CDN
```

## Database Schema

### users Table
```sql
CREATE TABLE users (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    username VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL DEFAULT 'ADMIN',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### blog_posts Table
```sql
CREATE TABLE blog_posts (
    id BIGINT PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(255) NOT NULL,
    content TEXT NOT NULL,
    author_name VARCHAR(255),
    published BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### blog_post_images Table
```sql
CREATE TABLE blog_post_images (
    blog_post_id BIGINT,
    image_url VARCHAR(500),
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);
```

### blog_post_videos Table
```sql
CREATE TABLE blog_post_videos (
    blog_post_id BIGINT,
    video_url VARCHAR(500),
    FOREIGN KEY (blog_post_id) REFERENCES blog_posts(id) ON DELETE CASCADE
);
```

## Component Structure

### Frontend Components

```
src/
├── components/
│   └── ProtectedRoute.jsx       # Route guard for admin pages
├── pages/
│   ├── HomePage.jsx              # Public blog listing
│   ├── BlogPostDetail.jsx        # Public post detail view
│   └── admin/
│       ├── AdminLogin.jsx        # Admin login page
│       ├── AdminDashboard.jsx    # Admin post management
│       ├── CreatePost.jsx        # Create new post
│       └── EditPost.jsx          # Edit existing post
├── services/
│   └── api.js                    # API client and endpoints
├── utils/
│   └── auth.js                   # Auth helper functions
├── App.jsx                       # Main app with routing
└── main.jsx                      # App entry point
```

### Backend Package Structure

```
com.blog/
├── config/
│   ├── CloudinaryConfig.java     # Cloudinary configuration
│   ├── DataInitializer.java      # Default admin user setup
│   └── SecurityConfig.java       # Security & CORS config
├── controller/
│   ├── AuthController.java       # Authentication endpoints
│   ├── PublicBlogController.java # Public blog endpoints
│   └── AdminBlogController.java  # Admin blog endpoints
├── dto/
│   ├── LoginRequest.java         # Login request DTO
│   ├── JwtResponse.java          # JWT response DTO
│   ├── BlogPostRequest.java      # Blog post request DTO
│   └── BlogPostResponse.java     # Blog post response DTO
├── entity/
│   ├── User.java                 # User entity
│   └── BlogPost.java             # Blog post entity
├── repository/
│   ├── UserRepository.java       # User data access
│   └── BlogPostRepository.java   # Blog post data access
├── security/
│   ├── JwtTokenProvider.java     # JWT token generation/validation
│   ├── JwtAuthenticationFilter.java # JWT filter
│   └── CustomUserDetailsService.java # User details service
├── service/
│   ├── BlogPostService.java      # Blog post business logic
│   └── CloudinaryService.java    # Cloudinary integration
└── PersonalBlogApplication.java  # Main application class
```

## Deployment Considerations

### Environment Variables
- Database credentials
- JWT secret key
- Cloudinary credentials
- CORS allowed origins

### Production Checklist
- [ ] Change default admin password
- [ ] Use environment variables for sensitive data
- [ ] Enable HTTPS
- [ ] Configure production database
- [ ] Update CORS settings
- [ ] Set up proper logging
- [ ] Configure file upload limits
- [ ] Set up database backups
- [ ] Monitor Cloudinary usage/quota

## Scalability Considerations

### Current Limitations
- Single admin user model
- No pagination on blog posts
- No caching layer
- No CDN for static assets (except Cloudinary)

### Future Enhancements
- Add Redis for caching
- Implement pagination
- Add search functionality
- Support multiple admin users
- Add categories and tags
- Implement comments system
- Add analytics
- Email notifications

