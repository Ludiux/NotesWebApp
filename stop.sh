#!/bin/bash

echo "Stopping backend and frontend..."

pkill -f spring-boot
pkill -f vite

echo "All processes stopped."
