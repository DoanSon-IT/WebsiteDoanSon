# Personal Blog - Detailed Setup Guide

This guide will walk you through setting up the Personal Blog application step by step.

## Table of Contents
1. [Prerequisites Installation](#prerequisites-installation)
2. [Database Setup](#database-setup)
3. [Cloudinary Setup](#cloudinary-setup)
4. [Backend Configuration](#backend-configuration)
5. [Frontend Configuration](#frontend-configuration)
6. [Running the Application](#running-the-application)
7. [Testing the Application](#testing-the-application)
8. [Troubleshooting](#troubleshooting)

## Prerequisites Installation

### 1. Install Java 17

**Windows:**
- Download from [Oracle](https://www.oracle.com/java/technologies/downloads/#java17) or [Adoptium](https://adoptium.net/)
- Run the installer
- Verify: `java -version`

**macOS:**
```bash
brew install openjdk@17
```

**Linux:**
```bash
sudo apt update
sudo apt install openjdk-17-jdk
```

### 2. Install MySQL

**Windows:**
- Download [MySQL Installer](https://dev.mysql.com/downloads/installer/)
- Run installer and select "MySQL Server"
- Set root password during installation

**macOS:**
```bash
brew install mysql
brew services start mysql
```

**Linux:**
```bash
sudo apt update
sudo apt install mysql-server
sudo systemctl start mysql
```

### 3. Install Node.js

**All Platforms:**
- Download from [nodejs.org](https://nodejs.org/) (LTS version)
- Run the installer
- Verify: `node -v` and `npm -v`

### 4. Install Maven (Optional - included in project)

**Windows:**
- Download from [maven.apache.org](https://maven.apache.org/download.cgi)
- Extract and add to PATH

**macOS/Linux:**
```bash
# macOS
brew install maven

# Linux
sudo apt install maven
```

## Database Setup

### 1. Start MySQL

```bash
# Windows (if not running as service)
net start MySQL80

# macOS
brew services start mysql

# Linux
sudo systemctl start mysql
```

### 2. Login to MySQL

```bash
mysql -u root -p
```

### 3. Create Database

```sql
CREATE DATABASE personal_blog;
CREATE USER 'bloguser'@'localhost' IDENTIFIED BY 'blogpassword';
GRANT ALL PRIVILEGES ON personal_blog.* TO 'bloguser'@'localhost';
FLUSH PRIVILEGES;
EXIT;
```

## Cloudinary Setup

### 1. Create Account

1. Go to [cloudinary.com](https://cloudinary.com/)
2. Click "Sign Up for Free"
3. Complete registration

### 2. Get Credentials

1. Login to Cloudinary Dashboard
2. You'll see:
   - **Cloud Name**: (e.g., `dxxxxx`)
   - **API Key**: (e.g., `123456789012345`)
   - **API Secret**: (e.g., `abcdefghijklmnopqrstuvwxyz`)
3. Copy these values

## Backend Configuration

### 1. Navigate to Backend Directory

```bash
cd backend/src/main/resources
```

### 2. Edit application.properties

Open `application.properties` and update:

```properties
# Database Configuration
spring.datasource.url=jdbc:mysql://localhost:3306/personal_blog?createDatabaseIfNotExist=true&useSSL=false&serverTimezone=UTC
spring.datasource.username=bloguser
spring.datasource.password=blogpassword

# Cloudinary Configuration
cloudinary.cloud-name=YOUR_CLOUD_NAME_HERE
cloudinary.api-key=YOUR_API_KEY_HERE
cloudinary.api-secret=YOUR_API_SECRET_HERE

# JWT Secret - CHANGE THIS!
jwt.secret=my-super-secret-jwt-key-that-should-be-at-least-256-bits-long-for-security
```

### 3. Build Backend

```bash
cd ../../..  # Back to backend directory
mvn clean install
```

## Frontend Configuration

### 1. Navigate to Frontend Directory

```bash
cd ../frontend
```

### 2. Install Dependencies

```bash
npm install
```

### 3. Verify Configuration

The frontend is pre-configured to connect to `http://localhost:8080` for the backend API.

If you need to change this, edit `frontend/src/services/api.js`:

```javascript
const API_BASE_URL = 'http://localhost:8080/api';
```

## Running the Application

### 1. Start Backend (Terminal 1)

```bash
cd backend
mvn spring-boot:run
```

Wait for the message: `Started PersonalBlogApplication`

You should see:
```
Default admin user created - Username: admin, Password: admin123
```

### 2. Start Frontend (Terminal 2)

```bash
cd frontend
npm run dev
```

You should see:
```
VITE v5.x.x  ready in xxx ms

➜  Local:   http://localhost:5173/
```

## Testing the Application

### 1. Test Public Access

1. Open browser: `http://localhost:5173`
2. You should see the blog homepage
3. Initially, there will be no posts

### 2. Test Admin Login

1. Navigate to: `http://localhost:5173/admin`
2. Login with:
   - Username: `admin`
   - Password: `admin123`
3. You should be redirected to the admin dashboard

### 3. Create a Test Post

1. Click "Create New Post"
2. Fill in:
   - Title: "My First Blog Post"
   - Content: "This is my first blog post!"
   - Author Name: "Admin"
3. Optionally upload an image
4. Click "Create Post"

### 4. View Public Blog

1. Navigate to: `http://localhost:5173`
2. You should see your new post
3. Click on it to view details

## Troubleshooting

### Backend Issues

**Problem: Port 8080 already in use**
```
Solution: Change port in application.properties:
server.port=8081
```

**Problem: Database connection failed**
```
Solution: 
1. Verify MySQL is running
2. Check username/password in application.properties
3. Ensure database exists
```

**Problem: JWT errors**
```
Solution: Ensure jwt.secret is at least 256 bits (32 characters)
```

### Frontend Issues

**Problem: Cannot connect to backend**
```
Solution:
1. Verify backend is running on port 8080
2. Check browser console for CORS errors
3. Verify API_BASE_URL in api.js
```

**Problem: npm install fails**
```
Solution:
1. Delete node_modules and package-lock.json
2. Run: npm cache clean --force
3. Run: npm install
```

### Cloudinary Issues

**Problem: Image upload fails**
```
Solution:
1. Verify Cloudinary credentials in application.properties
2. Check Cloudinary dashboard for quota limits
3. Ensure file size is under 10MB
```

## Next Steps

1. **Change Admin Password**: Create a new admin user with a secure password
2. **Customize Styling**: Modify TailwindCSS classes in React components
3. **Add More Features**: Extend the application with categories, tags, comments, etc.
4. **Deploy**: Consider deploying to cloud platforms (Heroku, AWS, etc.)

## Support

If you encounter issues not covered here:
1. Check the main README.md
2. Review application logs
3. Open an issue in the repository

Happy Blogging! 🎉

