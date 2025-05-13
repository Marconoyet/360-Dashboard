@echo off
setlocal enabledelayedexpansion

echo Installing backend dependencies...
cd backend
if not exist node_modules (
    echo node_modules not found in backend. Installing dependencies...
    npm install
    echo Backend dependencies installed successfully.
)
echo Starting backend...
start cmd /k "npm start"
cd ..

echo Installing frontend dependencies...
cd frontend
if not exist node_modules (
    echo node_modules not found in frontend. Installing dependencies...
    npm install -f
    echo Frontend dependencies installed successfully.
)
echo Starting frontend...
start cmd /k "npm run dev"

:: Wait for frontend to start (adjust timeout if needed)
timeout /t 5 /nobreak >nul

:: Open frontend in browser
start http://localhost:5173/

cd ..
echo Project is running!
pause
