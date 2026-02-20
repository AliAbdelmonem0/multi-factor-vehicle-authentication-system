@echo off
echo Starting Backend Server with Network Access...
cd backend
uvicorn main:app --reload --host 0.0.0.0
pause
