#!/bin/bash
mkdir -p uploads
cd backend
uvicorn main:app --host 0.0.0.0 --port $PORT
