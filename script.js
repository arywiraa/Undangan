// ============================================
// WEDDING INVITATION JAVASCRIPT
// Arya & Reva - 14 February 2026
// ============================================

// Global Variables
let videoWatched = false;
let bgMusic;

// ============================================
// INITIALIZATION
// ============================================
document.addEventListener('DOMContentLoaded', function() {
    loadUcapan();
    startCountdown();
    
    // Initialize background music (uncomment jika sudah ada file MP3)
    bgMusic = document.getElementById('bg-music');
});

// ============================================
// OPEN INVITATION
// ============================================
function openInvitation() {
    // Play background music
    if (bgMusic) {
        bgMusic.play().catch(e => console.log('Autoplay prevented'));
    }
    
    // Load and play video
    const videoPlayer = document.getElementById('video-player');
    videoPlayer.src = 'https://www.youtube.com/embed/Xene8hPdFqw?autoplay=1&mute=1&controls=0&showinfo=0&rel=0&loop=1&playlist=Xene8hPdFqw';
    // GANTI URL VIDEO DI ATAS dengan kode video YouTube kamu
    
    // Smooth scroll to video section
    document.getElementById('video-section').scrollIntoView({
        behavior: 'smooth'
    });
    
    // Start video lock mechanism
    setTimeout(() => {
        lockScrollDuringVideo();
    }, 1000);
}

// ============================================
// VIDEO SECTION SCROLL LOCK
// ============================================
function lockScrollDuringVideo() {
    const body = document.body;
    const swipeIndicator = document.getElementById('swipe-indicator');
    const floatingNav = document.getElementById('floating-navbar');
    
    // Lock scroll
    body.classList.add('scroll-locked');
    
    // Show swipe indicator after 10 seconds (adjust based on video length)
    setTimeout(() => {
        swipeIndicator.classList.add('show');
        body.classList.remove('scroll-locked');
        videoWatched = true;
        
        // Show floating navbar
        floatingNav.classList.add('show');
    }, 10000); // 10 detik, sesuaikan dengan durasi video
}

// ============================================
// COUNTDOWN TIMER
// ============================================
function startCountdown() {
    const weddingDate = new Date('February 14, 2026 10:00:00').getTime();
    
    const countdown = setInterval(() => {
        const now = new Date().getTime();
        const distance = weddingDate - now;
        
        // Calculate time
        const days = Math.floor(distance / (1000 * 60 * 60 * 24));
        const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((distance % (1000 * 60)) / 1000);
        
        // Update display
        document.getElementById('days').textContent = days;
        document.getElementById('hours').textContent = hours;
        document.getElementById('minutes').textContent = minutes;
        document.getElementById('seconds').textContent = seconds;
        
        // Check if countdown finished
        if (distance < 0) {
            clearInterval(countdown);
            document.getElementById('days').textContent = '0';
            document.getElementById('hours').textContent = '0';
            document.getElementById('minutes').textContent = '0';
            document.getElementById('seconds').textContent = '0';
        }
    }, 1000);
}

// ============================================
// COPY ACCOUNT NUMBER
// ============================================
function copyAccountNumber() {
    const accountNumber = document.getElementById('account-number').textContent;
    
    // Copy to clipboard
    navigator.clipboard.writeText(accountNumber).then(() => {
        // Show success message
        const btn = event.target.closest('.btn-copy');
        const originalText = btn.innerHTML;
        
        btn.innerHTML = '<i class="fas fa-check"></i> Tersalin!';
        btn.style.background = 'var(--sage-green)';
        
        setTimeout(() => {
            btn.innerHTML = originalText;
            btn.style.background = 'var(--dark-sage)';
        }, 2000);
    }).catch(err => {
        alert('Gagal menyalin: ' + accountNumber);
    });
}

// ============================================
// RSVP FORM SUBMISSION
// ============================================
async function submitRSVP(event) {
    event.preventDefault();
    
    const nama = document.getElementById('nama').value;
    const kehadiran = document.getElementById('kehadiran').value;
    const ucapan = document.getElementById('ucapan').value;
    
    // Create data object
    const data = {
        nama: nama,
        kehadiran: kehadiran,
        ucapan: ucapan,
        timestamp: new Date().toISOString()
    };
    
    // Save to persistent storage
    await saveUcapan(data);
    
    // Reset form
    document.getElementById('nama').value = '';
    document.getElementById('kehadiran').value = '';
    document.getElementById('ucapan').value = '';
    
    // Reload ucapan list
    await loadUcapan();
    
    // Scroll to ucapan list
    document.querySelector('.ucapan-list').scrollIntoView({
        behavior: 'smooth',
        block: 'nearest'
    });
}

// ============================================
// SAVE UCAPAN (PERSISTENT STORAGE)
// ============================================
async function saveUcapan(data) {
    try {
        // Get existing ucapan
        const existing = await window.storage.get('wedding-ucapan', true);
        let ucapanList = [];
        
        if (existing && existing.value) {
            ucapanList = JSON.parse(existing.value);
        }
        
        // Add new ucapan
        ucapanList.unshift(data);
        
        // Save back to storage
        await window.storage.set('wedding-ucapan', JSON.stringify(ucapanList), true);
        
        return true;
    } catch (error) {
        console.error('Error saving ucapan:', error);
        return false;
    }
}

// ============================================
// LOAD UCAPAN (PERSISTENT STORAGE)
// ============================================
async function loadUcapan() {
    try {
        const result = await window.storage.get('wedding-ucapan', true);
        
        if (result && result.value) {
            const ucapanList = JSON.parse(result.value);
            displayUcapan(ucapanList);
        } else {
            // No data yet
            document.getElementById('ucapan-list').innerHTML = 
                '<p style="text-align: center; color: #999; padding: 20px;">Belum ada ucapan</p>';
        }
    } catch (error) {
        console.error('Error loading ucapan:', error);
        // If error (no data), show empty state
        document.getElementById('ucapan-list').innerHTML = 
            '<p style="text-align: center; color: #999; padding: 20px;">Belum ada ucapan</p>';
    }
}

// ============================================
// DISPLAY UCAPAN
// ============================================
function displayUcapan(ucapanList) {
    const container = document.getElementById('ucapan-list');
    
    if (ucapanList.length === 0) {
        container.innerHTML = '<p style="text-align: center; color: #999; padding: 20px;">Belum ada ucapan</p>';
        return;
    }
    
    let html = '';
    
    ucapanList.forEach(item => {
        const statusClass = item.kehadiran === 'Tidak Hadir' ? 'tidak-hadir' : '';
        
        html += `
            <div class="ucapan-item">
                <div class="ucapan-header">
                    <span class="ucapan-name">${escapeHtml(item.nama)}</span>
                    <span class="ucapan-status ${statusClass}">${item.kehadiran}</span>
                </div>
                <p class="ucapan-text">${escapeHtml(item.ucapan)}</p>
            </div>
        `;
    });
    
    container.innerHTML = html;
}

// ============================================
// ESCAPE HTML (SECURITY)
// ============================================
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

// ============================================
// FLOATING NAVBAR SCROLL TO SECTION
// ============================================
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    
    if (section) {
        section.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }
}

// ============================================
// SHOW/HIDE NAVBAR ON SCROLL
// ============================================
window.addEventListener('scroll', () => {
    const floatingNav = document.getElementById('floating-navbar');
    const videoSection = document.getElementById('video-section');
    const videoBottom = videoSection.offsetTop + videoSection.offsetHeight;
    
    if (window.scrollY > videoBottom - 100 && videoWatched) {
        floatingNav.classList.add('show');
    } else if (window.scrollY < videoBottom - 100) {
        floatingNav.classList.remove('show');
    }
});