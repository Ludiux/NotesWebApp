#!/bin/bash

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"

echo "Starting backend..."
cd "$SCRIPT_DIR/backend/notesapp"
./mvnw spring-boot:run &
BACKEND_PID=$!

echo "Starting frontend..."
cd "$SCRIPT_DIR/frontend/notesSpaReactApp"
npm run dev &
FRONTEND_PID=$!

echo "App running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

wait
