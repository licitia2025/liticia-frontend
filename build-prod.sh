#!/bin/bash
export VITE_API_URL="https://liticia-backend.onrender.com/api/v1"
echo "Building frontend with API URL: $VITE_API_URL"
pnpm run build
