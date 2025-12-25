# Personal Blog Application

A full-stack personal blog application built with Spring Boot backend and React frontend, featuring JWT authentication, Cloudinary media storage, and a modern admin dashboard.

## 🚀 Features

### Public Features
- View all published blog posts
- Read individual blog posts with images and videos
- Responsive design with TailwindCSS
- No authentication required for public access

### Admin Features (Protected)
- Secure JWT-based authentication
- Create, Read, Update, Delete (CRUD) blog posts
- Upload images and videos to Cloudinary
- Manage post publication status
- Admin dashboard accessible only at `/admin` route

## 🛠️ Technology Stack

### Backend
- **Framework**: Spring Boot 3.2.0
- **Language**: Java 17
- **Database**: MySQL
- **Security**: Spring Security with JWT
- **Media Storage**: Cloudinary
- **Build Tool**: Maven

### Frontend
- **Framework**: React 18
- **Build Tool**: Vite
- **Styling**: TailwindCSS
- **Routing**: React Router v6
- **HTTP Client**: Axios

## 📋 Prerequisites

Before running this application, ensure you have:

- Java 17 or higher
- Node.js 18 or higher
- MySQL 8.0 or higher
- Maven 3.6 or higher
- Cloudinary account (free tier available)

## 🔧 Installation & Setup

### 1. Clone the Repository

```bash
git clone <repository-url>
cd Website_DoanSon
```

### 2. Database Setup

Create a MySQL database:

```sql
CREATE DATABASE personal_blog;
```

### 3. Backend Configuration

Navigate to `backend/src/main/resources/application.properties` and update:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/personal_blog?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=YOUR_MYSQL_USERNAME
spring.datasource.password=YOUR_MYSQL_PASSWORD

# Cloudinary Configuration
cloudinary.cloud-name=YOUR_CLOUDINARY_CLOUD_NAME
cloudinary.api-key=YOUR_CLOUDINARY_API_KEY
cloudinary.api-secret=YOUR_CLOUDINARY_API_SECRET

# JWT Secret (Change this to a secure random string)
jwt.secret=your-secret-key-change-this-to-a-very-long-and-secure-random-string-at-least-256-bits
```

### 4. Get Cloudinary Credentials

1. Sign up at [Cloudinary](https://cloudinary.com/)
2. Go to Dashboard
3. Copy your Cloud Name, API Key, and API Secret
4. Update the `application.properties` file

### 5. Run Backend

```bash
cd backend
mvn clean install
mvn spring-boot:run
```

The backend will start on `http://localhost:8080`

**Default Admin Credentials:**
- Username: `admin`
- Password: `admin123`

### 6. Run Frontend

Open a new terminal:

```bash
cd frontend
npm install
npm run dev
```

The frontend will start on `http://localhost:5173`

## 📱 Usage

### Public Access
1. Open `http://localhost:5173` in your browser
2. Browse published blog posts
3. Click on any post to read the full content

### Admin Access
1. Navigate to `http://localhost:5173/admin`
2. Login with credentials (default: admin/admin123)
3. Access the admin dashboard
4. Create, edit, or delete blog posts
5. Upload images and videos

## 🔐 Security Features

- JWT token-based authentication
- Password encryption with BCrypt
- Protected admin routes (both frontend and backend)
- CORS configuration for secure cross-origin requests
- Session stateless architecture

## 📁 Project Structure

```
Website_DoanSon/
├── backend/
│   ├── src/main/java/com/blog/
│   │   ├── config/          # Configuration classes
│   │   ├── controller/      # REST controllers
│   │   ├── dto/             # Data Transfer Objects
│   │   ├── entity/          # JPA entities
│   │   ├── repository/      # Data repositories
│   │   ├── security/        # Security & JWT components
│   │   └── service/         # Business logic
│   └── src/main/resources/
│       └── application.properties
├── frontend/
│   ├── src/
│   │   ├── components/      # Reusable components
│   │   ├── pages/           # Page components
│   │   │   ├── admin/       # Admin pages
│   │   │   ├── HomePage.jsx
│   │   │   └── BlogPostDetail.jsx
│   │   ├── services/        # API services
│   │   ├── utils/           # Utility functions
│   │   ├── App.jsx
│   │   └── main.jsx
│   └── package.json
└── README.md
```

## 🌐 API Endpoints

### Public Endpoints
- `GET /api/public/posts` - Get all published posts
- `GET /api/public/posts/{id}` - Get post by ID

### Authentication
- `POST /api/auth/login` - Admin login

### Admin Endpoints (Requires JWT)
- `GET /api/admin/posts` - Get all posts (including drafts)
- `GET /api/admin/posts/{id}` - Get post by ID
- `POST /api/admin/posts` - Create new post
- `PUT /api/admin/posts/{id}` - Update post
- `DELETE /api/admin/posts/{id}` - Delete post
- `POST /api/admin/posts/upload/image` - Upload image
- `POST /api/admin/posts/upload/video` - Upload video

## 🎨 Customization

### Change Admin Credentials
After first login, you can create new admin users by directly inserting into the database or by creating a registration endpoint (not included for security).

### Styling
Modify TailwindCSS classes in React components to customize the appearance.

### Database Schema
The application uses JPA with `ddl-auto=update`, so schema changes will be automatically applied.

## 📝 License

This project is open source and available under the MIT License.

## 🤝 Contributing

Contributions, issues, and feature requests are welcome!

## 📧 Support

For support, please open an issue in the repository.

