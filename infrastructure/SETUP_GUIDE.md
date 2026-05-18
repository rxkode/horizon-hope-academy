# Horizon Hope Academy — Complete Setup Guide
**Version:** 1.0 | **Tested on:** Ubuntu 24.04, Windows 11 WSL2

---

## 🐧 Ubuntu / Debian / Linux

```bash
# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install core tools
sudo apt install -y git curl wget build-essential

# 3. Node.js 20+
curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
sudo apt install -y nodejs
node --version  # should be v20+

# 4. Python 3 + pip
sudo apt install -y python3 python3-pip python3-venv
python3 --version

# 5. Docker Engine
sudo apt install -y docker.io docker-compose-v2
sudo systemctl enable docker && sudo systemctl start docker
sudo usermod -aG docker $USER
# LOG OUT AND BACK IN for docker group to take effect
newgrp docker

# 6. Verify
docker run hello-world
```

---

## 🪟 Windows 11 / 10 — WSL2 Path (Recommended)

Open **PowerShell as Administrator**:

```powershell
# Install WSL2 with Ubuntu
wsl --install -d Ubuntu

# After reboot, open Ubuntu from Start Menu and set username/password
# Then follow the Ubuntu steps above inside WSL2
```

Install Docker Desktop:
1. Download from https://www.docker.com/products/docker-desktop/
2. Install and tick **"Use the WSL 2 based engine"** in Settings → General
3. In Settings → Resources → WSL Integration, enable Ubuntu

---

## 🪟 Windows Native (No WSL2 — low-resource machines)

1. **Git:** https://git-scm.com/download/win — install Git Bash
2. **Node.js:** https://nodejs.org — LTS installer
3. **Python:** https://python.org/downloads — tick "Add to PATH"
4. In Git Bash:

```bash
cd C:/Users/YourName
git clone <repo-url> horizon-hope-academy
cd horizon-hope-academy
npm install --prefix frontend
python -m pip install -r backend/requirements.txt
# Start manually (no Docker on low-resource):
cd frontend && npm run dev   # terminal 1
cd backend && uvicorn app.main:app --reload  # terminal 2
```

---

## 🚀 One-Command Launch (Docker required)

```bash
chmod +x setup.sh
./setup.sh
```

Access points after launch:
| Service | URL |
|---------|-----|
| Public website | http://localhost:3000 |
| API + Swagger | http://localhost:8000/api/docs |
| School portal | http://localhost:8080 |
| Portal login | admin@horizonhopeacademy.sc.ke / HHA_Admin_2025! |
