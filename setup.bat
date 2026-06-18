@echo off
chcp 65001 >nul
echo [*] Устанавливаю зависимости...
call npm install express multer cors

if not exist "public" mkdir public
if not exist "public\assets\video" mkdir public\assets\video
if not exist "public\assets\music" mkdir public\assets\music
if not exist "public\assets\avatar" mkdir public\assets\avatar
if not exist "public\assets\icons" mkdir public\assets\icons

if not exist "public\data.json" (
    (
        echo {
        echo   "name": "Твой Ник",
        echo   "tagline": "@username",
        echo   "bio": "Привет! Это моя страничка.\nЗдесь все мои ссылки и любимая музыка.",
        echo   "avatar": "",
        echo   "video": "",
        echo   "tracks": [],
        echo   "links": [
        echo     { "title": "Telegram", "url": "https://t.me/username", "icon": "fab fa-telegram" },
        echo     { "title": "YouTube", "url": "https://youtube.com/@username", "icon": "fab fa-youtube" },
        echo     { "title": "Discord", "url": "https://discord.gg/invite", "icon": "fab fa-discord" }
        echo   ]
        echo }
    ) > public\data.json
)

echo [✓] Готово!
timeout /t 2 >nul