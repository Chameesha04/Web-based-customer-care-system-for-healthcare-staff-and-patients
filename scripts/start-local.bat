@echo off
REM Healthcare Customer Care System - Start Local Services
REM This script starts both backend and frontend locally

echo.
echo 🚀 Starting Healthcare Customer Care System Locally
echo ==================================================
echo.

echo [INFO] Starting backend and frontend services...
echo.

REM Start backend in a new window
echo [INFO] Starting backend server...
start "Healthcare Backend" cmd /k "cd backend && mvn spring-boot:run"

REM Wait a bit for backend to start
echo [INFO] Waiting for backend to start...
timeout /t 10 /nobreak >nul

REM Start frontend in a new window
echo [INFO] Starting frontend server...
start "Healthcare Frontend" cmd /k "cd frontend && npm start"

echo.
echo [SUCCESS] Both services are starting! 🎉
echo.
echo [INFO] Services will be available at:
echo 🌐 Frontend: http://localhost:3000
echo 🔧 Backend API: http://localhost:8080/api
echo 🗄️  H2 Database Console: http://localhost:8080/api/h2-console
echo.
echo [INFO] Database Details:
echo - JDBC URL: jdbc:h2:mem:healthcare_db
echo - Username: sa
echo - Password: (leave empty)
echo.
echo [INFO] Two new command windows will open for backend and frontend
echo [INFO] Close those windows to stop the services
echo.

pause



