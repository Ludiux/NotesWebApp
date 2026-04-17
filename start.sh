#!/bin/bash

echo "Starting backend..."
cd backend
./mvnw spring-boot:run &
BACKEND_PID=$!

echo "Starting frontend..."
cd ../frontend
npm install
npm run dev &
FRONTEND_PID=$!

echo "App running!"
echo "Backend PID: $BACKEND_PID"
echo "Frontend PID: $FRONTEND_PID"

wait
