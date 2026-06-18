let data = {};
let currentTrack = 0;
let started = false;
const audio = document.getElementById('audio');
const playBtn = document.getElementById('playBtn');
const progress = document.getElementById('progress');
const preloader = document.getElementById('preloader');
const mainContent = document.getElementById('mainContent');

function makeAvatarSVG(letter) {
    const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="200" height="200">
        <defs><linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stop-color="#8b5cf6"/>
            <stop offset="50%" stop-color="#ec4899"/>
            <stop offset="100%" stop-color="#3b82f6"/>
        </linearGradient></defs>
        <rect width="200" height="200" fill="url(#g)"/>
        <text x="100" y="130" font-size="100" font-family="Arial,sans-serif" font-weight="bold" fill="white" text-anchor="middle">${letter || '?'}</text>
    </svg>`;
    return 'data:image/svg+xml;base64,' + btoa(unescape(encodeURIComponent(svg)));
}

async function load() {
    const res = await fetch('/api/data?t=' + Date.now());
    data = await res.json();
    render();
}

function render() {
    document.getElementById('name').textContent = data.name || '';
    document.getElementById('tagline').textContent = data.tagline || '';
    document.getElementById('bio').textContent = data.bio || '';

    const avatarImg = document.getElementById('avatar');
    if (data.avatar) {
        avatarImg.src = data.avatar;
        avatarImg.onerror = () => { avatarImg.src = makeAvatarSVG((data.name || '?')[0]); };
    } else {
        avatarImg.src = makeAvatarSVG((data.name || '?')[0]);
    }

    const vid = document.getElementById('bgVideo');
    if (data.video) { vid.src = data.video; vid.style.display = 'block'; }
    else vid.style.display = 'none';

    const linksEl = document.getElementById('links');
    linksEl.innerHTML = '';
    (data.links || []).forEach(link => {
        const a = document.createElement('a');
        a.href = link.url;
        a.target = '_blank';
        a.className = 'link-item';
        a.innerHTML = `<i class="${link.icon}"></i><span>${link.title}</span><i class="fas fa-arrow-right arrow"></i>`;
        linksEl.appendChild(a);
    });

    renderPlayer();
}

function renderPlayer() {
    const tracks = data.tracks || [];
    if (tracks.length === 0) {
        document.getElementById('trackName').textContent = 'Нет треков';
        document.getElementById('trackArtist').textContent = '';
        document.getElementById('player').style.display = 'none';
        return;
    }
    document.getElementById('player').style.display = 'flex';
    if (currentTrack >= tracks.length) currentTrack = 0;
    const t = tracks[currentTrack];
    document.getElementById('trackName').textContent = t.title || 'Без названия';
    document.getElementById('trackArtist').textContent = t.artist || '';
    if (audio.src !== location.origin + t.url) {
        audio.src = t.url;
        if (started) audio.play().catch(()=>{});
    }
}

// === ПРЕЛОАДЕР ===
function startSite() {
    if (started) return;
    started = true;
    preloader.classList.add('hidden');
    mainContent.style.opacity = '1';

    const tracks = data.tracks || [];
    if (tracks.length > 0) {
        audio.volume = document.getElementById('volume').value / 100;
        audio.play().then(() => {
            playBtn.innerHTML = '<i class="fas fa-pause"></i>';
            playBtn.classList.add('playing');
        }).catch(err => console.log('Автоплей заблокирован:', err));
    }

    const vid = document.getElementById('bgVideo');
    if (vid.src) vid.muted = false;
}

preloader.addEventListener('click', startSite);
document.addEventListener('keydown', e => {
    if (e.code === 'Space' || e.code === 'Enter') startSite();
});

// === УПРАВЛЕНИЕ ===
playBtn.onclick = () => {
    if (!audio.src) return;
    if (audio.paused) {
        audio.play();
        playBtn.innerHTML = '<i class="fas fa-pause"></i>';
        playBtn.classList.add('playing');
    } else {
        audio.pause();
        playBtn.innerHTML = '<i class="fas fa-play"></i>';
        playBtn.classList.remove('playing');
    }
};

document.getElementById('prevBtn').onclick = () => {
    const len = data.tracks?.length || 1;
    currentTrack = (currentTrack - 1 + len) % len;
    renderPlayer();
    if (started) audio.play().catch(()=>{});
};

document.getElementById('nextBtn').onclick = () => {
    const len = data.tracks?.length || 1;
    currentTrack = (currentTrack + 1) % len;
    renderPlayer();
    if (started) audio.play().catch(()=>{});
};

audio.onended = () => document.getElementById('nextBtn').click();
audio.ontimeupdate = () => {
    if (audio.duration) progress.style.width = (audio.currentTime / audio.duration * 100) + '%';
};

document.getElementById('progressWrap').onclick = (e) => {
    if (!audio.duration) return;
    const rect = e.currentTarget.getBoundingClientRect();
    audio.currentTime = ((e.clientX - rect.left) / rect.width) * audio.duration;
};

// Громкость
const volumeSlider = document.getElementById('volume');
const volIcon = document.getElementById('volIcon');
let lastVolume = 70;
volumeSlider.oninput = () => {
    audio.volume = volumeSlider.value / 100;
    updateVolIcon();
};
volIcon.onclick = () => {
    if (audio.volume > 0) {
        lastVolume = volumeSlider.value;
        audio.volume = 0;
        volumeSlider.value = 0;
    } else {
        audio.volume = lastVolume / 100;
        volumeSlider.value = lastVolume;
    }
    updateVolIcon();
};
function updateVolIcon() {
    const v = audio.volume;
    if (v === 0) volIcon.className = 'fas fa-volume-xmark';
    else if (v < 0.4) volIcon.className = 'fas fa-volume-low';
    else volIcon.className = 'fas fa-volume-high';
}

audio.volume = 0.7;
load();
setInterval(load, 3000);