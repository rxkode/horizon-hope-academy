#!/usr/bin/env bash
set -e

echo "=========================================="
echo "  Horizon Hope Academy — System Setup"
echo "  Shamata, Nyandarua County, Kenya"
echo "=========================================="

# Dependency checks
command -v docker  >/dev/null 2>&1 || { echo "❌ Docker not found. See infrastructure/SETUP_GUIDE.md"; exit 1; }
command -v node    >/dev/null 2>&1 || { echo "❌ Node.js not found."; exit 1; }
command -v python3 >/dev/null 2>&1 || { echo "❌ Python3 not found."; exit 1; }
command -v git     >/dev/null 2>&1 || { echo "❌ Git not found."; exit 1; }

echo "✅ All dependencies found"

# Backend venv
if [ ! -d "backend/.venv" ]; then
  echo "Creating Python virtual environment..."
  python3 -m venv backend/.venv
fi
source backend/.venv/bin/activate
pip install -q -r backend/requirements.txt
echo "✅ Backend dependencies installed"

# Frontend
echo "Installing frontend dependencies..."
cd frontend && npm ci --silent && cd ..
echo "✅ Frontend dependencies installed"

# Launch Docker stack
echo "Starting Docker services..."
cd infrastructure/docker
docker compose pull --quiet 2>/dev/null || true
docker compose up -d --build

echo ""
echo "=========================================="
echo "  ✅ Horizon Hope Academy is running!"
echo "=========================================="
echo "  🌐 Website:       http://localhost:3000"
echo "  📡 API Docs:      http://localhost:8000/api/docs"
echo "  🏫 School Portal: http://localhost:8080"
echo "\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\=\="
echo ""
echo "  Start frontend dev server separately:"
echo "  cd frontend && npm run dev"
echo "=========================================="
