// ============ MAIN APP CONTROLLER ============

function showToast(message, duration = 1800) {
    const container = document.getElementById('toast-container');
    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.textContent = message;
    container.appendChild(toast);
    setTimeout(() => toast.remove(), duration + 300);
}

// Tab switching
document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
        document.querySelectorAll('.game-container').forEach(g => g.classList.remove('active'));
        btn.classList.add('active');
        const gameId = btn.dataset.game + '-game';
        document.getElementById(gameId).classList.add('active');
    });
});

// Utility: shuffle array
function shuffleArray(arr) {
    const a = [...arr];
    for (let i = a.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [a[i], a[j]] = [a[j], a[i]];
    }
    return a;
}
