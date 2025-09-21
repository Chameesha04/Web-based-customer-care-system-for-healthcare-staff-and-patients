# Healthcare Customer Care System - Setup Guide

This guide will walk you through setting up and running the Healthcare Customer Care System locally without Docker.

## 📋 Prerequisites

Before you begin, ensure you have the following installed:

- **Java 17+** - [Download from Oracle](https://www.oracle.com/java/technologies/downloads/) or [OpenJDK](https://openjdk.org/)
- **Node.js 18+** - [Download from nodejs.org](https://nodejs.org/)
- **Git** - [Download from git-scm.com](https://git-scm.com/)

## 🚀 Quick Start

### Option 1: Automated Setup (Recommended)

```bash
# Clone the repository
git clone <your-repository-url>
cd healthcare-customer-care

# Run simple setup (Windows)
scripts\simple-setup.bat

# Start the application
scripts\start-local.bat
```

### Option 2: Manual Setup

**Step 1: Clone the Repository**
```bash
git clone <your-repository-url>
cd healthcare-customer-care
```

**Step 2: Setup Backend**
```bash
cd backend
mvn clean install
mvn spring-boot:run
```

**Step 3: Setup Frontend (New Terminal)**
```bash
cd frontend
npm install
npm start
```

**Step 4: Access the Application**
- Frontend: http://localhost:3000
- Backend API: http://localhost:8080/api
- H2 Database Console: http://localhost:8080/api/h2-console

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

```bash
# Local Development Configuration
REACT_APP_API_URL=http://localhost:8080/api
JWT_SECRET=local-development-secret-key
```

### Backend Configuration

The backend uses H2 in-memory database by default. No additional configuration needed!

### Frontend Configuration

The frontend automatically connects to the backend API at `http://localhost:8080/api`.

## 🧪 Testing the Setup

### 1. Check Backend Health

```bash
# Test backend health endpoint
curl http://localhost:8080/api/actuator/health

# Expected response:
# {"status":"UP"}
```

### 2. Check Frontend

Open http://localhost:3000 and verify:
- Login page loads
- No console errors
- API calls work

### 3. Check Database

Open http://localhost:8080/api/h2-console and verify:
- JDBC URL: `jdbc:h2:mem:healthcare_db`
- Username: `sa`
- Password: (leave empty)

## 🐛 Troubleshooting

### Common Issues

#### 1. Port Already in Use

```bash
# Check what's using port 8080
netstat -ano | findstr :8080

# Kill the process or change port in application.yml
server:
  port: 8081
```

#### 2. Java Issues

```bash
# Check Java version
java -version

# Set JAVA_HOME if needed
set JAVA_HOME=C:\Program Files\Java\jdk-17
```

#### 3. Node.js Issues

```bash
# Check Node.js version
node --version

# Clear npm cache
npm cache clean --force

# Delete node_modules and reinstall
rm -rf node_modules package-lock.json
npm install
```

#### 4. Maven Issues

```bash
# Check Maven version
mvn --version

# Clean Maven cache
mvn clean

# Skip tests if needed
mvn clean install -DskipTests
```

## 📊 Database Information

### H2 In-Memory Database

- **Type**: H2 In-Memory Database
- **JDBC URL**: `jdbc:h2:mem:healthcare_db`
- **Username**: `sa`
- **Password**: (leave empty)
- **Console**: http://localhost:8080/api/h2-console
- **No installation required!**

### Database Schema

The system automatically creates the following tables:
- `users` - System users with role-based access
- `customers` - Patient information and medical history
- `appointments` - Scheduled appointments and bookings
- `medical_cases` - Medical cases requiring SMO approval
- `staff_schedules` - Staff availability and scheduling
- `support_tickets` - Customer support requests

## 🔄 Development Workflow

### 1. Making Changes

```bash
# Backend changes (auto-reloads with Spring Boot DevTools)
cd backend
mvn spring-boot:run

# Frontend changes (auto-reloads with React)
cd frontend
npm start
```

### 2. Running Tests

```bash
# Backend tests
cd backend
mvn test

# Frontend tests
cd frontend
npm test
```

### 3. Building for Production

```bash
# Build backend
cd backend
mvn clean package

# Build frontend
cd frontend
npm run build
```

## 🚀 Production Deployment

### Option 1: Traditional Server

```bash
# Build backend
cd backend
mvn clean package

# Build frontend
cd frontend
npm run build

# Deploy JAR file and build folder to your server
```

### Option 2: Cloud Deployment

- **Backend**: Deploy JAR file to cloud platforms (AWS, GCP, Azure)
- **Frontend**: Deploy build folder to static hosting (Netlify, Vercel, AWS S3)

## 📝 Development Guidelines

### Code Organization
- Each team member works in their designated module
- Shared components go in `frontend/src/components/`
- API services are organized by module
- Database entities are in `backend/src/main/java/com/group/project/`

### Git Workflow
- Feature branches for new development
- Pull requests for code review
- Main branch for production-ready code
- Develop branch for integration testing

### Code Standards
- Backend: Follow Spring Boot best practices
- Frontend: Use TypeScript strict mode
- Use ESLint and Prettier for code formatting
- Write comprehensive tests

## 🔒 Security

- JWT-based authentication
- Role-based access control (RBAC)
- Input validation and sanitization
- CORS configuration
- Security headers

## 📈 Monitoring & Observability

- Spring Boot Actuator for health checks
- Application metrics and monitoring
- Structured logging
- Error tracking and reporting

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the system administrator
- Check the documentation in each module

---

**Happy Coding! 🎉**