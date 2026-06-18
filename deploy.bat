@echo off
chcp 65001 >nul
echo.
echo  ╔══════════════════════════════════════╗
echo  ║   DEPLOY TO FIREBASE                 ║
echo  ╚══════════════════════════════════════╝
echo.

where npx >nul 2>nul
if %errorlevel% neq 0 (
    echo [!] Node.js не найден!
    pause
    exit /b
)

:: Создаём firebase.json с правильными заголовками кэширования
if not exist "firebase.json" (
    echo [*] Создаю firebase.json...
    (
        echo {
        echo   "hosting": {
        echo     "public": "public",
        echo     "ignore": ["firebase.json", "**/.*", "**/node_modules/**"],
        echo     "headers": [
        echo       {
        echo         "source": "data.json",
        echo         "headers": [
        echo           { "key": "Cache-Control", "value": "no-cache, no-store, must-revalidate" },
        echo           { "key": "Pragma", "value": "no-cache" },
        echo           { "key": "Expires", "value": "0" }
        echo         ]
        echo       },
        echo       {
        echo         "source": "**",
        echo         "headers": [
        echo           { "key": "Cache-Control", "value": "public, max-age=0, must-revalidate" }
        echo         ]
        echo       }
        echo     ]
        echo   }
        echo }
    ) > firebase.json
)

if not exist ".firebaserc" (
    echo [*] Первый раз? Сейчас откроется настройка...
    echo [*] Выбери: Hosting, public folder = public, SPA = No
    echo.
    npx firebase init hosting
)

echo.
echo [*] Деплою...
npx firebase deploy --only hosting

echo.
echo [✓] Готово! Ссылка выше.
echo [i] Если изменения не видны — нажми Ctrl+F5 на сайте.
pause