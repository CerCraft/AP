@echo off
chcp 65001 >nul
title Profile Site Launcher
color 0A

echo.
echo  ╔══════════════════════════════════════╗
echo  ║   PROFILE SITE - LAUNCHING...        ║
echo  ╚══════════════════════════════════════╝
echo.

:: Проверка Node.js
where node >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js не найден! Скачай с https://nodejs.org
    pause
    exit /b
)

:: Если нет node_modules — запускаем установку
if not exist "node_modules" (
    echo [*] Первый запуск — устанавливаю зависимости...
    call setup.bat
)

:: Создаём папку assets если нет
if not exist "public\assets\video" mkdir "public\assets\video"
if not exist "public\assets\music" mkdir "public\assets\music"
if not exist "public\assets\avatar" mkdir "public\assets\avatar"

:: Запускаем локальный сервер
echo.
echo [*] Запускаю сервер...
echo [*] Открой в браузере: http://localhost:5000
echo [*] Веб-панель:        http://localhost:5000/panel.html
echo.
echo [*] Для деплоя на Firebase: deploy.bat
echo.
node server.js
pause