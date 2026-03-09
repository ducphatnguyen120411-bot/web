// CẤU HÌNH - QUAN TRỌNG
const PANDASCORE_TOKEN = 'SPIzCftkl59rBdbPlw3G9b2P1whGM2_BI-Hopaic2QfVag1Ai8I'; 
const YT_PLAYLIST = 'PLhchmqHcwM_0_R_QY7K-H4o7d8-WzJpA_'; // Playlist CS2 Highlights

function switchTab(id) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(id).classList.add('active');
    event.currentTarget.classList.add('active');
}

function toggleCinema() {
    document.getElementById('player-wrapper').classList.toggle('cinema');
}

async function initCS2TV() {
    const player = document.getElementById('video-player');
    const title = document.getElementById('tv-title');
    const domain = window.location.hostname;

    try {
        // 1. Tìm trận đấu đang LIVE
        const response = await fetch(`https://api.pandascore.co/csgo/matches/running?token=${PANDASCORE_TOKEN}`);
        const matches = await response.json();

        if (matches && matches.length > 0) {
            // Lấy trận đầu tiên đang live
            const match = matches[0];
            const streamUrl = match.live_url; // Ví dụ: https://twitch.tv/esl_cs
            
            if (streamUrl && streamUrl.includes('twitch.tv')) {
                const channel = streamUrl.split('/').pop();
                title.innerHTML = `🔴 LIVE: ${match.name}`;
                player.innerHTML = `<iframe src="https://player.twitch.tv/?channel=${channel}&parent=${domain}&autoplay=true" allowfullscreen></iframe>`;
            } else {
                playFallback(player, title);
            }
        } else {
            playFallback(player, title);
        }
    } catch (e) {
        console.error("API Error", e);
        playFallback(player, title);
    }
    loadSchedule();
}

function playFallback(player, title) {
    title.innerHTML = `<i class="fa-solid fa-film"></i> Đang phát: CS2 Highlights 24/7`;
    player.innerHTML = `<iframe src="https://www.youtube.com/embed/videoseries?list=${YT_PLAYLIST}&autoplay=1&mute=1" allow="autoplay" allowfullscreen></iframe>`;
}

async function loadSchedule() {
    const list = document.getElementById('matches-list');
    try {
        const res = await fetch(`https://api.pandascore.co/csgo/matches/upcoming?token=${PANDASCORE_TOKEN}&per_page=6`);
        const data = await res.json();
        
        list.innerHTML = data.map(m => `
            <div class="match-card">
                <div style="font-size:12px; color:#fca311; margin-bottom:10px">${m.league.name}</div>
                <div style="display:flex; justify-content:space-between; font-weight:bold">
                    <span>${m.opponents[0]?.opponent.name || 'TBD'}</span>
                    <span style="color:#555">VS</span>
                    <span>${m.opponents[1]?.opponent.name || 'TBD'}</span>
                </div>
                <div style="margin-top:15px; font-size:13px; color:#888">
                    ${new Date(m.begin_at).toLocaleString('vi-VN')}
                </div>
            </div>
        `).join('');
    } catch (e) { list.innerHTML = "Không thể tải lịch thi đấu."; }
}

window.onload = initCS2TV;
