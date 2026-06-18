<div align="center">



# AuraPage

**Генератор атмосферных сайтов-визиток**

[![Version](https://img.shields.io/badge/version-1.0.0-8b5cf6?style=flat-square)]()
[![License](https://img.shields.io/badge/license-MIT-ec4899?style=flat-square)](LICENSE)
[![Node](https://img.shields.io/badge/node-%3E%3D16-10b981?style=flat-square)]()
[![Deploy](https://img.shields.io/badge/deploy-Firebase-3b82f6?style=flat-square)]()
[![Status](https://img.shields.io/badge/status-stable-22c55e?style=flat-square)]()

[Быстрый старт](#быстрый-старт) · [Документация](https://yourname.github.io/aurapage/) 

</div>

---

## О проекте

**AuraPage (AP)** — локальный генератор персональных сайтов-визиток. Запускаешь один `.bat` файл — получаешь готовый сайт с веб-панелью для управления. Видео на фон, музыкальный плеер, ссылки на соцсети с иконками, аватар и описание — всё настраивается через браузер без правки кода. Деплой на Firebase Hosting одной командой.

### Ключевые возможности

- **Прелоадер** — стартовый экран "нажми чтобы войти", после клика стартует сайт и музыка
- **Видео-фон** — зацикленное видео на весь экран с затемнением
- **Музыкальный плеер** — несколько треков, название + исполнитель, громкость, перемотка
- **Профиль** — аватар (с авто-генерацией по первой букве), имя, подзаголовок, био
- **Ссылки** — 20+ готовых иконок соцсетей (Telegram, Discord, YouTube, TikTok, VK и др.) + свои
- **Веб-панель** — все настройки через браузер, автосохранение
- **Деплой** — бесплатный хостинг на Firebase одной командой
- **Без бэкенда на хостинге** — всё статично, работает на любом CDN

---

## Скриншоты

<div align="center">
<table>
<tr>
<td><img src="docs/screenshots/preloader.png" alt="Прелоадер" width="300"/></td>
<td><img src="docs/screenshots/profile.png" alt="Профиль" width="300"/></td>
</tr>
<tr>
<td><img src="docs/screenshots/panel.png" alt="Панель" width="300"/></td>
<td><img src="docs/screenshots/player.png" alt="Плеер" width="300"/></td>
</tr>
</table>
</div>

---

## Технологии

| Стек | Использование |
|------|---------------|
| **Node.js** | Локальный сервер и API загрузки файлов |
| **Express** | HTTP-сервер, REST API |
| **Multer** | Загрузка файлов (видео, аудио, изображения) |
| **HTML5 / CSS3** | Фронтенд сайта и панели |
| **Vanilla JS** | Логика без фреймворков |
| **Font Awesome 6** | Иконки соцсетей и интерфейса |
| **Firebase Hosting** | Бесплатный деплой |

---

## Быстрый старт

### Требования

- **Windows 10/11** (батники) или cross-platform через `node` напрямую
- **Node.js** >= 16 ([скачать](https://nodejs.org))
- **Git** (опционально)

### Установка

```bash
# 1. Клонируй репозиторий
git clone https://github.com/yourname/aurapage.git
cd aurapage

# 2. Запусти стартовый скрипт
start.bat
