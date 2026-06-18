const express = require('express');
const multer = require('multer');
const cors = require('cors');
const fs = require('fs');
const path = require('path');

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json({ limit: '500mb' }));
app.use(express.urlencoded({ extended: true, limit: '500mb' }));
app.use(express.static('public'));

// Настройка загрузок
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        let folder = 'public/assets/';
        if (file.mimetype.startsWith('video/')) folder += 'video/';
        else if (file.mimetype.startsWith('audio/')) folder += 'music/';
        else if (file.mimetype.startsWith('image/')) folder += 'avatar/';
        else folder += 'icons/';
        cb(null, folder);
    },
    filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        const name = Date.now() + '-' + Math.random().toString(36).substr(2,5) + ext;
        cb(null, name);
    }
});
const upload = multer({ storage, limits: { fileSize: 500 * 1024 * 1024 } });

// Загрузка файла
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).json({ error: 'Нет файла' });
    let type = 'other';
    if (req.file.mimetype.startsWith('video/')) type = 'video';
    else if (req.file.mimetype.startsWith('audio/')) type = 'music';
    else if (req.file.mimetype.startsWith('image/')) type = 'image';
    res.json({
        url: `/assets/${type === 'video' ? 'video' : type === 'music' ? 'music' : type === 'image' ? 'avatar' : 'icons'}/${req.file.filename}`,
        name: req.file.originalname,
        type
    });
});

// Получить data.json
app.get('/api/data', (req, res) => {
    fs.readFile('public/data.json', 'utf8', (err, data) => {
        if (err) return res.json({});
        res.json(JSON.parse(data));
    });
});

// Сохранить data.json
app.post('/api/data', (req, res) => {
    fs.writeFile('public/data.json', JSON.stringify(req.body, null, 2), (err) => {
        if (err) return res.status(500).json({ error: 'Ошибка сохранения' });
        res.json({ ok: true });
    });
});

// Удалить файл
app.post('/api/delete', (req, res) => {
    const { path: filePath } = req.body;
    const fullPath = path.join('public', filePath);
    if (fs.existsSync(fullPath)) fs.unlinkSync(fullPath);
    res.json({ ok: true });
});

app.listen(PORT, () => {
    console.log('');
    console.log('  ╔══════════════════════════════════════════╗');
    console.log(`  ║  Сайт:    http://localhost:${PORT}           ║`);
    console.log(`  ║  Панель:  http://localhost:${PORT}/panel.html ║`);
    console.log('  ╚══════════════════════════════════════════╝');
    console.log('');
});