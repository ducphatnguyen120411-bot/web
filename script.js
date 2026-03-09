// ==========================================
// CẤU HÌNH CƠ BẢN
// ==========================================
// Thay GITHUB_USERNAME bằng tên username GitHub của bạn để Twitch Embed hoạt động!
// Ví dụ: tài khoản github là 'nguyenvana' thì điền 'nguyenvana'
const GITHUB_USERNAME = 'yourusername'; 

// Danh sách các kênh Twitch luôn có giải đấu hoặc phát lại CS2
const FALLBACK_TWITCH_CHANNELS = ['ESL_CS', 'BLASTPremier', 'ESL_CS_b'];
// Playlist YouTube Highlight CS2 cực xịn làm phương án dự phòng cuối
const YOUTUBE_PLAYLIST_ID = 'PLhchmqHcwM_0_R_QY7K-H4o7d8-WzJpA_';

// ==========================================
// ĐIỀU HƯỚNG & UI
// ==========================================
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(tab => tab.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(btn => btn.classList.remove('active'));
    
    document.getElementById(tabId).classList.add('active');
    document.getElementById('btn-' + tabId).classList.add('active');
}

function toggleCinemaMode() {
    const wrapper = document.getElementById('player-wrapper');
    wrapper.classList.toggle('cinema');
    
    // Thoát cinema mode khi bấm ESC
    if (wrapper.classList.contains('cinema')) {
        document.addEventListener('keydown', function escHandler(e) {
            if (e.key === 'Escape') {
                wrapper.classList.remove('cinema');
                document.removeEventListener('keydown', escHandler);
            }
        });
    }
}

// ==========================================
// LOGIC AUTO TV (Tự động phát không cần API Key)
// ==========================================
function startAutoTV() {
    const playerContainer = document.getElementById('video-player');
    const tvTitle = document.getElementById('tv-title');
    
    // Chọn ngẫu nhiên 1 kênh Twitch phổ biến
    const selectedChannel = FALLBACK_TWITCH_CHANNELS[Math.floor(Math.random() * FALLBACK_TWITCH_CHANNELS.length)];
    const parentDomain = GITHUB_USERNAME !== 'yourusername' ? `${GITHUB_USERNAME}.github.io` : 'localhost';

    tvTitle.innerHTML = `<i class="fa-solid fa-satellite-dish" style="color: #00ff00;"></i> Đang phát: Kênh chuyên nghiệp (TWITCH)`;
    
    // Nhúng thẳng iframe của Twitch
    playerContainer.innerHTML = `
        <iframe 
            src="https://player.twitch.tv/?channel=${selectedChannel}&parent=${parentDomain}&autoplay=true&muted=false" 
            allowfullscreen>
        </iframe>
    `;

    // Nếu bạn muốn dùng YouTube làm mặc định thay vì Twitch, dùng đoạn code dưới đây (Bỏ comment đoạn dưới, comment đoạn Twitch trên):
    /*
    tvTitle.innerHTML = `<i class="fa-solid fa-play"></i> Đang phát: Highlight CS2 (YOUTUBE)`;
    playerContainer.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/videoseries?list=${YOUTUBE_PLAYLIST_ID}&autoplay=1" 
            allow="autoplay; encrypted-media" 
            allowfullscreen>
        </iframe>
    `;
    */
}

// ==========================================
// DỮ LIỆU LỊCH ĐẤU "PREMIUM MOCK"
// ==========================================
function loadMatches() {
    const matchesContainer = document.getElementById('matches-list');
    
    // Dữ liệu mô phỏng cực sát thực tế
    const mockMatches = [
        { team1: "FaZe Clan", team2: "NAVI", time: "Đang diễn ra - Map 2: Mirage", isLive: true, score: "1 - 1" },
        { team1: "Vitality", team2: "G2 Esports", time: "Hôm nay | 22:00 VN", isLive: false, score: "BO3" },
        { team1: "MOUZ", team2: "Spirit", time: "Ngày mai | 01:30 VN", isLive: false, score: "BO3" },
        { team1: "Cloud9", team2: "Heroic", time: "Ngày mai | 18:00 VN", isLive: false, score: "BO3" },
    ];

    matchesContainer.innerHTML = mockMatches.map(match => `
        <div class="match-card">
            <div class="match-status ${match.isLive ? 'live' : 'upcoming'}">
                ${match.isLive ? '🔴 LIVE' : 'Sắp diễn ra'}
            </div>
            <div class="teams">
                <div class="team">${match.team1}</div>
                <div class="vs">${match.score}</div>
                <div class="team">${match.team2}</div>
            </div>
            <div class="match-time"><i class="fa-regular fa-clock"></i> ${match.time}</div>
        </div>
    `).join('');
}

// Khởi chạy
window.onload = () => {
    startAutoTV();
    loadMatches();
};
