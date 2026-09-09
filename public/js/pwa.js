// ========================================
// Progressive Web App (PWA) Configuration
// ========================================

// Register Service Worker with Auto Update Checking
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/service-worker.js')
            .then(registration => {
                console.log('Service Worker registered successfully:', registration.scope);
                registration.update();
            })
            .catch(error => {
                console.log('Service Worker registration failed:', error);
            });
    });
}

// Install prompt
let deferredPrompt;

window.addEventListener('beforeinstallprompt', (e) => {
    // Prevent the mini-infobar from appearing on mobile
    e.preventDefault();
    
    // Stash the event so it can be triggered later
    deferredPrompt = e;
    
    // Show install button/banner
    showInstallPromotion();
});

function showInstallPromotion() {
    // Create install banner if not exists
    if (document.getElementById('installBanner')) return;
    
    const banner = document.createElement('div');
    banner.id = 'installBanner';
    banner.style.cssText = `
        position: fixed;
        bottom: 20px;
        left: 50%;
        transform: translateX(-50%);
        background: var(--color-primary);
        color: white;
        padding: 1rem 1.5rem;
        border-radius: 10px;
        box-shadow: 0 4px 20px rgba(0,0,0,0.3);
        z-index: 9999;
        display: flex;
        align-items: center;
        gap: 1rem;
        max-width: 90%;
        animation: slideUp 0.3s ease;
    `;
    
    banner.innerHTML = `
        <span>📱 Install FinTrack untuk akses lebih mudah!</span>
        <button id="installBtn" style="
            background: white;
            color: var(--color-primary);
            border: none;
            padding: 0.5rem 1rem;
            border-radius: 5px;
            cursor: pointer;
            font-weight: bold;
        ">Install</button>
        <button id="dismissBtn" style="
            background: transparent;
            border: none;
            color: white;
            cursor: pointer;
            font-size: 1.5rem;
            line-height: 1;
        ">&times;</button>
    `;
    
    document.body.appendChild(banner);
    
    // Install button click
    document.getElementById('installBtn').addEventListener('click', async () => {
        if (!deferredPrompt) return;
        
        // Show the install prompt
        deferredPrompt.prompt();
        
        // Wait for the user to respond to the prompt
        const { outcome } = await deferredPrompt.userChoice;
        
        if (outcome === 'accepted') {
            console.log('User accepted the install prompt');
        } else {
            console.log('User dismissed the install prompt');
        }
        
        // Clear the deferred prompt
        deferredPrompt = null;
        banner.remove();
    });
    
    // Dismiss button click
    document.getElementById('dismissBtn').addEventListener('click', () => {
        banner.remove();
    });
}

// Track when app is installed
window.addEventListener('appinstalled', () => {
    console.log('FinTrack has been installed');
    deferredPrompt = null;
    
    if (window.app) {
        window.app.showToast('FinTrack berhasil diinstall!', 'success');
    }
});

// Online/Offline detection
window.addEventListener('online', () => {
    if (window.app) {
        window.app.showToast('Kembali online! Sinkronisasi data...', 'success');
        cloudSync.syncToCloud();
    }
});

window.addEventListener('offline', () => {
    if (window.app) {
        window.app.showToast('Anda sedang offline. Data disimpan lokal.', 'warning');
    }
});

// Handle notifications permission
function requestNotificationPermission() {
    if ('Notification' in window && Notification.permission === 'default') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                console.log('Notification permission granted');
            }
        });
    }
}

// Send notification for budget alert
function sendBudgetNotification(message) {
    if ('Notification' in window && Notification.permission === 'granted') {
        const notification = new Notification('Peringatan Anggaran', {
            body: message,
            icon: '/icons/icon-192.png',
            badge: '/icons/icon-192.png',
            vibrate: [200, 100, 200],
            tag: 'budget-alert'
        });
        
        notification.onclick = () => {
            window.focus();
            notification.close();
        };
    }
}

// Request notification permission after some time
setTimeout(() => {
    requestNotificationPermission();
}, 10000);

// Export for use in other modules
window.sendBudgetNotification = sendBudgetNotification;
