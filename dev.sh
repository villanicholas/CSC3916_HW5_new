#!/bin/bash

# Start the backend server
echo "Starting backend server..."
node server.js &

# Wait a bit for the backend to start
sleep 3

# Start the React development server
echo "Starting React development server..."
cd client && npm start

# Capture CTRL+C and kill all background processes
trap "trap - SIGTERM && kill -- -$$" SIGINT SIGTERM EXIT 