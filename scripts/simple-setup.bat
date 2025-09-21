@echo off
REM Healthcare Customer Care System - Simple Local Setup (No Docker)
REM This script sets up the project to run locally without Docker

echo.
echo 🏥 Healthcare Customer Care System - Simple Local Setup
echo =====================================================
echo.

echo [INFO] This setup runs everything locally without Docker
echo [INFO] You only need Java and Node.js installed
echo.

REM Check Java
echo [INFO] Checking Java...
java -version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Java is not installed
    echo [INFO] Please install Java 17+ from: https://www.oracle.com/java/technologies/downloads/
    echo [INFO] Or install OpenJDK: https://openjdk.org/
    pause
    exit /b 1
) else (
    echo [SUCCESS] Java is available
)

REM Check Node.js
echo [INFO] Checking Node.js...
node --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js is not installed
    echo [INFO] Please install Node.js 18+ from: https://nodejs.org/
    pause
    exit /b 1
) else (
    echo [SUCCESS] Node.js is available
)

echo.

REM Setup backend
echo [INFO] Setting up backend...
cd backend

REM Check if Maven is available
mvn --version >nul 2>&1
if %errorlevel% neq 0 (
    echo [WARNING] Maven not found, trying Maven wrapper...
    if exist mvnw.cmd (
        echo [INFO] Using Maven wrapper...
        call mvnw.cmd clean install -DskipTests
    ) else (
        echo [ERROR] Maven is not installed and no wrapper found
        echo [INFO] Please install Maven from: https://maven.apache.org/download.cgi
        cd ..
        pause
        exit /b 1
    )
) else (
    echo [INFO] Using Maven...
    mvn clean install -DskipTests
)

if %errorlevel% neq 0 (
    echo [ERROR] Backend setup failed
    cd ..
    pause
    exit /b 1
) else (
    echo [SUCCESS] Backend setup complete
)

cd ..

echo.

REM Setup frontend
echo [INFO] Setting up frontend...
cd frontend

echo [INFO] Installing npm dependencies...
npm install

if %errorlevel% neq 0 (
    echo [ERROR] Frontend setup failed
    cd ..
    pause
    exit /b 1
) else (
    echo [SUCCESS] Frontend setup complete
)

cd ..

echo.

REM Create environment file
echo [INFO] Creating environment configuration...
(
echo # Local Development Configuration
echo REACT_APP_API_URL=http://localhost:8080/api
echo JWT_SECRET=local-development-secret-key
) > .env

echo [SUCCESS] Environment file created (.env)
echo.

echo [SUCCESS] Setup completed successfully! 🎉
echo.
echo [INFO] Next steps:
echo 1. Start the backend: cd backend ^&^& mvn spring-boot:run
echo 2. Start the frontend: cd frontend ^&^& npm start
echo 3. Access the application at http://localhost:3000
echo.
echo [INFO] Database: H2 in-memory database (no installation needed)
echo [INFO] H2 Console: http://localhost:8080/api/h2-console
echo.

pause



