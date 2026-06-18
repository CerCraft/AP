let data = {};
let selectedIcon = 'fas fa-link';

const ICONS = [
    { i: 'fab fa-telegram', n: 'Telegram' },
    { i: 'fab fa-discord', n: 'Discord' },
    { i: 'fab fa-instagram', n: 'Instagram' },
    { i: 'fab fa-youtube', n: 'YouTube' },
    { i: 'fab fa-tiktok', n: 'TikTok' },
    { i: 'fab fa-vk', n: 'VK' },
    { i: 'fab fa-github', n: 'GitHub' },
    { i: 'fab fa-x-twitter', n: 'X / Twitter' },
    { i: 'fab fa-spotify', n: 'Spotify' },
    { i: 'fab fa-twitch', n: 'Twitch' },
    { i: 'fab fa-steam', n: 'Steam' },
    { i: 'fab fa-whatsapp', n: 'WhatsApp' },
    { i: 'fab fa-snapchat', n: 'Snapchat' },
    { i: 'fab fa-reddit', n: 'Reddit' },
    { i: 'fab fa-pinterest', n: 'Pinterest' },
    { i: 'fab fa-linkedin', n: 'LinkedIn' },
    { i: 'fas fa-envelope', n: 'Email' },
    { i: 'fas fa-phone', n: 'Телефон' },
    { i: 'fas fa-globe', n: 'Сайт' },
    { i: 'fas fa-link', n: 'Ссылка' }
];

async function load() {
    const res = await fetch('/api/data');
    data = await res.json();
    render();
}

function render() {
    document.getElementById('name').value = data.name || '';
    document.getElementById('tagline').value = data.tagline || '';
    document.getElementById('bio').value = data.bio || '';
    if (data.avatar) {
        const p = document.getElementById('avatarPreview');
        p.src = data.avatar; p.style.display = 'block';
    }
    if (data.video) {
        const v = document.getElementById('videoPreview');
        v.src = data.video; v.style.display = 'block';
        document.getElementById('videoInfo').textContent = '✓ Видео загружено';
    } else {
        document.getElementById('videoInfo').textContent = 'Видео не задано';
    }
    renderTracks();
    renderLinks();
}

function renderTracks() {
    const list = document.getElementById('tracksList');
    list.innerHTML = '';
    (data.tracks || []).forEach((t, i) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <div class="icon-preview"><i class="fas fa-music"></i></div>
            <div style="flex:1;min-width:200px;display:flex;flex-direction:column;gap:6px;">
                <input value="${(t.title||'').replace(/"/g,'&quot;')}" placeholder="Название трека" onchange="data.tracks[${i}].title=this.value;save()">
                <input value="${(t.artist||'').replace(/"/g,'&quot;')}" placeholder="Исполнитель" onchange="data.tracks[${i}].artist=this.value;save()" style="font-size:12px;opacity:0.85;">
            </div>
            <button class="danger small" onclick="removeTrack(${i})"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(div);
    });
}

function renderLinks() {
    const list = document.getElementById('linksList');
    list.innerHTML = '';
    (data.links || []).forEach((l, i) => {
        const div = document.createElement('div');
        div.className = 'item';
        div.innerHTML = `
            <div class="icon-preview"><i class="${l.icon}"></i></div>
            <input value="${l.title.replace(/"/g,'&quot;')}" onchange="data.links[${i}].title=this.value;save()" placeholder="Название">
            <input value="${l.url.replace(/"/g,'&quot;')}" onchange="data.links[${i}].url=this.value;save()" placeholder="https://...">
            <button class="danger small" onclick="removeLink(${i})"><i class="fas fa-trash"></i></button>
        `;
        list.appendChild(div);
    });
}

function renderIcons() {
    const grid = document.getElementById('iconGrid');
    grid.innerHTML = '';
    ICONS.forEach(ic => {
        const btn = document.createElement('div');
        btn.className = 'icon-btn' + (ic.i === selectedIcon ? ' active' : '');
        btn.innerHTML = `<i class="${ic.i}"></i><span>${ic.n}</span>`;
        btn.onclick = () => {
            selectedIcon = ic.i;
            document.getElementById('linkTitle').value = ic.n; // ← авто-название
            renderIcons();
        };
        grid.appendChild(btn);
    });
}

async function uploadFile(file) {
    const fd = new FormData();
    fd.append('file', file);
    const res = await fetch('/api/upload', { method: 'POST', body: fd });
    return await res.json();
}

function showToast(msg) {
    const t = document.getElementById('toast');
    if (msg) t.innerHTML = `<i class="fas fa-check"></i> ${msg}`;
    t.classList.add('show');
    clearTimeout(window._toastT);
    window._toastT = setTimeout(() => t.classList.remove('show'), 1800);
}

async function save() {
    await fetch('/api/data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data)
    });
    showToast();
}

document.getElementById('name').oninput = e => { data.name = e.target.value; save(); };
document.getElementById('tagline').oninput = e => { data.tagline = e.target.value; save(); };
document.getElementById('bio').oninput = e => { data.bio = e.target.value; save(); };

document.getElementById('avatarFile').onchange = async e => {
    if (!e.target.files[0]) return;
    showToast('Загрузка...');
    const r = await uploadFile(e.target.files[0]);
    data.avatar = r.url; save(); render();
};

document.getElementById('videoFile').onchange = async e => {
    if (!e.target.files[0]) return;
    showToast('Загрузка видео...');
    const r = await uploadFile(e.target.files[0]);
    data.video = r.url; save(); render();
};

async function removeVideo() {
    if (data.video) await fetch('/api/delete', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({path: data.video}) });
    data.video = ''; save(); render();
    document.getElementById('videoPreview').style.display = 'none';
}

document.getElementById('musicFile').onchange = async e => {
    for (const f of e.target.files) {
        const r = await uploadFile(f);
        if (!data.tracks) data.tracks = [];
        const name = f.name.replace(/\.[^.]+$/, '');
        // Пытаемся разделить "Исполнитель - Название"
        let title = name, artist = '';
        if (name.includes(' - ')) {
            const parts = name.split(' - ');
            artist = parts[0].trim();
            title = parts.slice(1).join(' - ').trim();
        }
        data.tracks.push({ title, artist, url: r.url });
    }
    save(); renderTracks();
    showToast('Треки добавлены');
};

async function removeTrack(i) {
    await fetch('/api/delete', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({path: data.tracks[i].url}) });
    data.tracks.splice(i, 1); save(); renderTracks();
}

function addLink() {
    const title = document.getElementById('linkTitle').value.trim();
    const url = document.getElementById('linkUrl').value.trim();
    if (!title || !url) { showToast('Заполни название и URL'); return; }
    if (!data.links) data.links = [];
    data.links.push({ title, url, icon: selectedIcon });
    document.getElementById('linkTitle').value = '';
    document.getElementById('linkUrl').value = '';
    save(); renderLinks();
    showToast('Ссылка добавлена');
}

async function removeLink(i) {
    data.links.splice(i, 1); save(); renderLinks();
}

renderIcons();
load();