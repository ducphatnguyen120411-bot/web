// 1. Dán Token của bạn vào đây
const PANDASCORE_TOKEN = 'SPIzCftkl59rBdbPlw3G9b2P1whGM2_BI-Hopaic2QfVag1Ai8I';

async function loadMatches() {
    const matchesContainer = document.getElementById('matches-list');
    matchesContainer.innerHTML = '<div class="loader"></div>'; // Hiển thị loading khi đang lấy data

    try {
        // Gọi API lấy các trận đấu CS2 sắp tới (sắp xếp theo thời gian)
        const response = await fetch(`https://api.pandascore.co/csgo/matches/upcoming?sort=begin_at&per_page=6`, {
            headers: {
                'Authorization': `Bearer ${PANDASCORE_TOKEN}`,
                'Accept': 'application/json'
            }
        });
        
        const matches = await response.json();

        if (matches.length === 0) {
            matchesContainer.innerHTML = "<p>Hiện không có giải đấu nào sắp diễn ra.</p>";
            return;
        }

        // Render dữ liệu thật ra giao diện
        matchesContainer.innerHTML = matches.map(match => {
            const isLive = match.status === 'running';
            const startTime = new Date(match.begin_at).toLocaleString('vi-VN', {
                day: '2-digit', month: '2-digit', hour: '2-digit', minute: '2-digit'
            });
            
            // Xử lý trường hợp team chưa xác định (TBD)
            const team1 = match.opponents[0]?.opponent.name || "TBD";
            const team2 = match.opponents[1]?.opponent.name || "TBD";
            const team1Logo = match.opponents[0]?.opponent.image_url || 'https://via.placeholder.com/50';
            const team2Logo = match.opponents[1]?.opponent.image_url || 'https://via.placeholder.com/50';

            return `
                <div class="match-card">
                    <div class="match-status ${isLive ? 'live' : 'upcoming'}">
                        ${isLive ? '🔴 LIVE NOW' : 'Sắp đấu'}
                    </div>
                    <div class="teams">
                        <div class="team">
                            <img src="${team1Logo}" width="40" style="display:block; margin: 0 auto 10px">
                            ${team1}
                        </div>
                        <div class="vs">VS</div>
                        <div class="team">
                            <img src="${team2Logo}" width="40" style="display:block; margin: 0 auto 10px">
                            ${team2}
                        </div>
                    </div>
                    <div class="match-time">
                        <i class="fa-solid fa-trophy"></i> ${match.league.name} <br>
                        <i class="fa-regular fa-clock"></i> ${startTime}
                    </div>
                </div>
            `;
        }).join('');

    } catch (error) {
        console.error("Lỗi lấy API:", error);
        matchesContainer.innerHTML = "<p>Không thể kết nối với máy chủ giải đấu.</p>";
    }
}
