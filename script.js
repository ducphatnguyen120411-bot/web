// ==========================================
// CẤU HÌNH API - DÁN TOKEN CỦA BẠN VÀO ĐÂY
// ==========================================
const PANDASCORE_TOKEN = 'SPIzCftkl59rBdbPlw3G9b2P1whGM2_BI-Hopaic2QfVag1Ai8I';
const YT_FALLBACK_PLAYLIST = 'PLhchmqHcwM_0_R_QY7K-H4o7d8-WzJpA_';

// ==========================================
// HÀM KHỞI TẠO TV (TỰ ĐỘNG FIX LỖI TWITCH)
// ==========================================
async function initAutoTV() {
    const playerContainer = document.getElementById('video-player');
    const tvTitle = document.getElementById('tv-title');
    
    // Lấy domain hiện tại để fix lỗi "Từ chối kết nối"
    const currentDomain = window.location.hostname;
    
    // Nếu chạy file cục bộ (không có domain), mặc định dùng localhost để test
    const parentParam = currentDomain || "localhost";

    try {
        // Gọi API PandaScore lấy trận đang LIVE
        const response = await fetch(`https://api.pandascore.co/csgo/matches/running?token=${PANDASCORE_TOKEN}`);
        const liveMatches = await response.json();

        if (liveMatches && liveMatches.length > 0) {
            // Ưu tiên trận có link Twitch
            const match = liveMatches[0];
            const streamUrl = match.live_url; 

            if (streamUrl && streamUrl.includes('twitch.tv')) {
                const channelName = streamUrl.split('/').pop();
                tvTitle.innerHTML = `<span class="live-dot"></span> ĐANG LIVE: ${match.name}`;
                
                playerContainer.innerHTML = `
                    <iframe 
                        src="https://player.twitch.tv/?channel=${channelName}&parent=${parentParam}&autoplay=true&muted=false" 
                        allowfullscreen="true">
                    </iframe>`;
                return;
            }
        }
        
        // Nếu không có trận Live, phát YouTube Highlights
        playYouTube(playerContainer, tvTitle);

    } catch (error) {
        console.error("Lỗi API, chuyển sang YouTube:", error);
        playYouTube(playerContainer, tvTitle);
    }
}

function playYouTube(container, title) {
    title.innerHTML = `<i class="fa-solid fa-video"></i> CS2 Pro Highlights 24/7`;
    container.innerHTML = `
        <iframe 
            src="https://www.youtube.com/embed/videoseries?list=${YT_FALLBACK_PLAYLIST}&autoplay=1&mute=1" 
            allow="autoplay; encrypted-media" 
            allowfullscreen>
        </iframe>`;
}

// ==========================================
// HÀM LẤY LỊCH THI ĐẤU THẬT
// ==========================================
async function loadRealMatches() {
    const container = document.getElementById('matches-list');
    
    try {
        const response = await fetch(`https://api.pandascore.co/csgo/matches/upcoming?token=${PANDASCORE_TOKEN}&per_page=6`);
        const data = await response.json();

        container.innerHTML = data.map(m => `
            <div class="match-card ${m.status === 'running' ? 'live' : ''}">
                <div class="league-name">${m.league.name}</div>
                <div class="match-main">
                    <div class="team">
                        <img src="${m.opponents[0]?.opponent.image_url || 'https://via.placeholder.com/40'}" onerror="this.src='https://via.placeholder.com/40'">
                        <p>${m.opponents[0]?.opponent.name || 'TBD'}</p>
                    </div>
                    <div class="vs">VS</div>
                    <div class="team">
                        <img src="${m.opponents[1]?.opponent.image_url || 'https://via.placeholder.com/40'}" onerror="this.src='https://via.placeholder.com/40'">
                        <p>${m.opponents[1]?.opponent.name || 'TBD'}</p>
                    </div>
                </div>
                <div class="match-footer">
                    ${new Date(m.begin_at).toLocaleString('vi-VN', {hour: '2-digit', minute:'2-digit', day:'2-digit', month:'2-digit'})}
                </div>
            </div>
        `).join('');
    } catch (e) {
        container.innerHTML = "<p>Không thể tải lịch đấu. Kiểm tra lại API Token.</p>";
    }
}

// Chuyển Tab
function switchTab(tabId) {
    document.querySelectorAll('.tab-content').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('.nav-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(tabId).classList.add('active');
    event.currentTarget.classList.add('active');
}

// Chạy khi web load xong
window.onload = () => {
    initAutoTV();
    loadRealMatches();
};
