#!/bin/bash

# Enable script to exit on error
set -e

echo "Installing backend dependencies..."
cd backend
if [ ! -d "node_modules" ]; then
    echo "node_modules not found in backend. Installing dependencies..."
    npm install
    echo "Backend dependencies installed successfully."
fi

echo "Starting backend..."
# Start backend in a new terminal tab
osascript -e 'tell app "Terminal" to do script "cd \"$(pwd)\" && npm start"'
cd ..

echo "Installing frontend dependencies..."
cd frontend
if [ ! -d "node_modules" ]; then
    echo "node_modules not found in frontend. Installing dependencies..."
    npm install -f
    echo "Frontend dependencies installed successfully."
fi

echo "Starting frontend..."
# Start frontend in a new terminal tab
osascript -e 'tell app "Terminal" to do script "cd \"$(pwd)\" && npm run dev"'

# Wait a few seconds for frontend to boot up
sleep 5

# Open frontend in browser
open http://localhost:5173/

cd ..
echo "Project is running!"
