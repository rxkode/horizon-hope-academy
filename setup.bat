@echo off
echo ==========================================
echo   Horizon Hope Academy -- System Setup
echo   Shamata, Nyandarua County, Kenya
echo ==========================================

where docker >nul 2>&1 || (echo Docker not found. See infrastructure\SETUP_GUIDE.md && exit /b 1)
where node   >nul 2>&1 || (echo Node.js not found. && exit /b 1)
where python >nul 2>&1 || (echo Python not found. && exit /b 1)

echo All dependencies found.

echo Installing frontend dependencies...
cd frontend && npm ci && cd ..

echo Starting Docker services...
cd infrastructure\docker
docker compose up -d --build

echo.
echo ==========================================
echo   Horizon Hope Academy is running!
echo ==========================================
echo   Website:       http://localhost:3000
echo   API Docs:      http://localhost:8000/api/docs
echo   School Portal: http://localhost:8080
echo ==========================================
