// ========================================
// Cloud Synchronization
// ========================================

class CloudSync {
    constructor() {
        this.isConnected = false;
        this.isSyncing = false;
        this.autoSyncInterval = null;
    }

    // ========================================
    // Connection
    // ========================================
    async connect() {
        const email = document.getElementById('cloudEmail').value;
        
        if (!email) {
            window.app.showToast('Masukkan email terlebih dahulu!', 'warning');
            return;
        }

        if (!this.validateEmail(email)) {
            window.app.showToast('Format email tidak valid!', 'error');
            return;
        }

        try {
            // Simulate cloud connection
            window.app.showToast('Menghubungkan ke cloud...', 'success');
            
            // In real implementation, this would connect to a cloud service
            // For now, we'll simulate it with localStorage
            storage.setCloudEmail(email);
            this.isConnected = true;
            
            // Start auto sync
            this.startAutoSync();
            
            // Initial sync
            await this.syncToCloud();
            
            window.app.updateCloudStatus();
            window.app.showToast('Berhasil terhubung ke cloud!', 'success');
        } catch (error) {
            console.error('Cloud connection error:', error);
            window.app.showToast('Gagal terhubung ke cloud!', 'error');
        }
    }

    disconnect() {
        storage.setCloudEmail('');
        this.isConnected = false;
        this.stopAutoSync();
        
        if (window.app) {
            window.app.updateCloudStatus();
            window.app.showToast('Terputus dari cloud', 'success');
        }
    }

    // ========================================
    // Sync Operations
    // ========================================
    async syncToCloud() {
        if (this.isSyncing) {
            console.log('Sync already in progress');
            return;
        }

        const email = storage.getCloudEmail();
        if (!email) {
            console.log('No cloud email configured');
            return;
        }

        this.isSyncing = true;
        const syncBtn = document.getElementById('syncBtn');
        if (syncBtn) {
            syncBtn.style.animation = 'spin 1s linear infinite';
        }

        try {
            // Simulate cloud sync
            await this.delay(1000);
            
            // In real implementation, this would:
            // 1. Upload data to cloud storage (Firebase, AWS, etc.)
            // 2. Check for updates from cloud
            // 3. Merge changes if any
            
            const data = {
                transactions: storage.getAllTransactions(),
                categories: storage.getCategories(),
                budget: storage.getDailyBudget(),
                lastSync: Date.now()
            };
            
            // Store in localStorage with cloud prefix (simulating cloud)
            localStorage.setItem(`cloud_${email}_data`, JSON.stringify(data));
            
            storage.setLastSyncTime(Date.now());
            
            if (window.app) {
                window.app.updateCloudStatus();
            }
            
            console.log('Data synced to cloud successfully');
        } catch (error) {
            console.error('Sync error:', error);
            if (window.app) {
                window.app.showToast('Gagal sinkronisasi!', 'error');
            }
        } finally {
            this.isSyncing = false;
            if (syncBtn) {
                syncBtn.style.animation = '';
            }
        }
    }

    async syncFromCloud() {
        const email = storage.getCloudEmail();
        if (!email) return;

        try {
            // Simulate cloud fetch
            const cloudData = localStorage.getItem(`cloud_${email}_data`);
            
            if (cloudData) {
                const data = JSON.parse(cloudData);
                
                // Merge logic (in real app, would be more sophisticated)
                const localLastSync = storage.getLastSyncTime() || 0;
                const cloudLastSync = data.lastSync || 0;
                
                if (cloudLastSync > localLastSync) {
                    // Cloud is newer, update local
                    storage.saveTransactions(data.transactions);
                    storage.saveCategories(data.categories);
                    storage.setDailyBudget(data.budget);
                    storage.setLastSyncTime(cloudLastSync);
                    
                    if (window.app) {
                        window.app.showToast('Data diperbarui dari cloud', 'success');
                        window.app.loadDashboard();
                    }
                }
            }
        } catch (error) {
            console.error('Sync from cloud error:', error);
        }
    }

    // ========================================
    // Auto Sync
    // ========================================
    startAutoSync() {
        // Auto sync every 5 minutes
        this.autoSyncInterval = setInterval(() => {
            this.syncToCloud();
        }, 5 * 60 * 1000);
        
        console.log('Auto sync started');
    }

    stopAutoSync() {
        if (this.autoSyncInterval) {
            clearInterval(this.autoSyncInterval);
            this.autoSyncInterval = null;
            console.log('Auto sync stopped');
        }
    }

    // ========================================
    // Utilities
    // ========================================
    validateEmail(email) {
        const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        return re.test(email);
    }

    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
}

// Create global cloud sync instance
const cloudSync = new CloudSync();

// Check for cloud connection on load
document.addEventListener('DOMContentLoaded', () => {
    const email = storage.getCloudEmail();
    if (email) {
        cloudSync.isConnected = true;
        cloudSync.startAutoSync();
    }
});
