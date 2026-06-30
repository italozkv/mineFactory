@echo off
cd /d "%~dp0"

where npm >nul 2>nul
if errorlevel 1 (
  echo Node.js/npm nao encontrado. Instale o Node.js e tente novamente.
  pause
  exit /b 1
)

if not exist node_modules (
  echo Instalando dependencias...
  call npm install
)

start "" "http://127.0.0.1:4174/"
call npm run dev:mods
