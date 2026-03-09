/**
 * CS2 TV - Siêu Script bởi Gemini
 * Client: fps pro
 */

// ==========================================
// 1. CẤU HÌNH API (Thay mã của bạn vào đây)
// ==========================================
const CONFIG = {
    PANDASCORE_TOKEN: 'SPIzCftkl59rBdbPlw3G9b2P1whGM2_BI-Hopaic2QfVag1Ai8I',
    YOUTUBE_API_KEY: 'AIzaSyDXIwX1vDxrF1mYuBmIXe0mUJzTJKvFau4',
    FALLBACK_VIDEO_ID: 'eOqD2Q5s2M0', // Video dự phòng nếu mọi thứ thất bại
    REFRESH_INTERVAL: 10 * 60 * 1000 // Tự động cập nhật sau mỗi 10 phút
};

// ==========================================
// 2. KHỞI TẠO HỆ THỐNG
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initCS2TV();
    loadSchedule();
    
    // Thiết lập vòng lặp cập nhật tự động
    setInterval(() => {
        console.log("Đang cập nhật dữ liệu mới...");
        initCS2TV();
        loadSchedule();
    }, CONFIG.REFRESH_INTERVAL);
});

// ==========================================
// 3. XỬ LÝ TV (TWITCH & YOUTUBE)
// ==========================================
async function initCS2TV() {
    const player = document.getElementById('video-player');
    const title = document.getElementById('tv-title');
    const currentDomain = window.location.hostname || "localhost";

    // Hiển thị trạng thái đang tải
    title.innerHTML = `<i class="fa-solid fa-spinner fa-spin"></i> Đang dò sóng...`;

    try {
        // ƯU TIÊN 1: Tìm trận đấu CS2 đang LIVE thật sự
        const response = await fetch(`https://api.pandascore.co/csgo/matches/running?token=${CONFIG.PANDASCORE_TOKEN}`);
        const matches = await response.json();

        if (matches && matches.length > 0) {
            const match = matches[0];
            if (match.live_url && match.live_url.includes('twitch.tv')) {
                const channel = match.live_url.split('/').pop();
                
                title.innerHTML = `<span class="live-dot"></span> TRỰC TIẾP: ${match.name}`;
                player.innerHTML = `
                    <iframe 
                        src="https://player.twitch.tv/?channel=${channel}&parent=${currentDomain}&autoplay=true&muted=false" 
                        allowfullscreen="true"
                        style="width:100%; height:100%; border:none;">
                    </iframe>`;
                return;
            }
        }

        // ƯU TIÊN 2: Nếu không có Live, dùng YouTube API tìm Highlight mới nhất trong ngày
        await loadYouTubeHighlight(player, title);

    } catch (error) {
        console.error("Lỗi hệ thống TV:", error);
        playFallback(player, title);
    }
}

async function loadYouTubeHighlight(player, title) {
    try {
        const query = encodeURIComponent("CS2 highlights pro matches 2024");
        const res = await fetch(`https://www.googleapis.com/youtube/v3/search?part=snippet&q=${query}&type=video&order=date&maxResults=1&key=${CONFIG.YOUTUBE_API_KEY}`);
        const data = await res.json();

        if (data.items && data.items.length > 0) {
            const videoId = data.items[0].id.videoId;
            title.innerHTML = `<i class="fa-solid fa-fire"></i> CS2 Highlights Mới Nhất`;
            player.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${videoId}?autoplay=1&mute=1&rel=0" 
                    allow="autoplay; encrypted-media" 
                    allowfullscreen
                    style="width:100%; height:100%; border:none;">
                </iframe>`;
        } else {
            throw new Error("Không tìm thấy video");
        }
    } catch (err) {
        playFallback(player, title);
    }
}

function playFallback(player, title) {
    title.innerHTML = `<i class="fa-solid fa-circle-exclamation"></i> Chế độ dự phòng`;
    player.innerHTML = `<iframe src="https://www.youtube.com/embed/${CONFIG.FALLBACK_VIDEO_ID}?autoplay=1" allowfullscreen style="width:100%; height:100%; border:none;"></iframe>`;
}

// ==========================================
// 4. XỬ LÝ LỊCH THI ĐẤU (PANDASCORE)
// ==========================================
async function loadSchedule() {
    const list = document.getElementById('matches-list');
    if (!list) return;

    try {
        const res = await fetch(`https://api.pandascore.co/csgo/matches/upcoming?token=${CONFIG.PANDASCORE_TOKEN}&per_page=8&sort=begin_at`);
        const data = await res.json();

        list.innerHTML = data.map(m => {
            const time = new Date(m.begin_at).toLocaleString('vi-VN', {
                hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit'
            });
            const team1 = m.opponents[0]?.opponent || { name: 'TBD', image_url: 'https://via.placeholder.com/40' };
            const team2 = m.opponents[1]?.opponent || { name: 'TBD', image_url: 'https://via.placeholder.com/40' };

            return `
                <div class="match-card">
                    <div class="league-tag">${m.league.name}</div>
                    <div class="teams-display">
                        <div class="team-info">
                            <img src="${team1.image_url}" alt="${team1.name}">
                            <span>${team1.name}</span>
                        </div>
                        <div class="vs-badge">VS</div>
                        <div class="team-info">
                            <img src="${team2.image_url}" alt="${team2.name}">
                            <span>${team2.name}</span>
                        </div>
                    </div>
                    <div class="match-time"><i class="fa-regular fa-clock"></i> ${time}</div>
                </div>
            `;
        }).join('');
    } catch (e) {
        list.innerHTML = `<p style="color:#666">Không thể tải lịch thi đấu lúc này.</p>`;
    }
}

// ==========================================
// 5. TIỆN ÍCH UI
// ==========================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}
