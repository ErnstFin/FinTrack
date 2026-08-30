// ========================================
// Demo Data Loader (untuk Testing)
// ========================================

// Fungsi untuk load data demo
function loadDemoData(skipConfirm = false) {
    if (!skipConfirm && !confirm('Load data demo? Data transaksi yang ada akan ditimpa dengan data demo 6 bulan terakhir.')) {
        return;
    }

    const today = new Date();
    const demoTransactions = [];
    
    // Generate transactions for last 6 months
    for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
        const month = new Date(today.getFullYear(), today.getMonth() - monthsAgo, 1);
        
        // Income: Gaji Pokok
        demoTransactions.push({
            id: `demo-income-${monthsAgo}-1`,
            type: 'income',
            category: '1', // Gaji Bulanan
            amount: 8500000,
            date: new Date(month.getFullYear(), month.getMonth(), 1).toISOString().split('T')[0],
            note: 'Gaji pokok bulan ' + month.toLocaleDateString('id-ID', { month: 'long' }),
            timestamp: new Date(month.getFullYear(), month.getMonth(), 1, 9, 0).getTime()
        });
        
        // Income: Freelance / Side Job
        if (monthsAgo % 2 === 0) {
            demoTransactions.push({
                id: `demo-income-freelance-${monthsAgo}`,
                type: 'income',
                category: '3', // Freelance
                amount: 2500000,
                date: new Date(month.getFullYear(), month.getMonth(), 18).toISOString().split('T')[0],
                note: 'Proyek UI/UX & Web Design',
                timestamp: new Date(month.getFullYear(), month.getMonth(), 18, 14, 30).getTime()
            });
        }

        // Income: Bonus (Bulan ini atau 3 bulan lalu)
        if (monthsAgo === 0 || monthsAgo === 3) {
            demoTransactions.push({
                id: `demo-income-bonus-${monthsAgo}`,
                type: 'income',
                category: '2', // Bonus
                amount: 2000000,
                date: new Date(month.getFullYear(), month.getMonth(), 15).toISOString().split('T')[0],
                note: 'Bonus pencapaian target',
                timestamp: new Date(month.getFullYear(), month.getMonth(), 15, 11, 0).getTime()
            });
        }

        // Daily Food & Drinks expenses (2-3 times per day)
        const daysInMonth = Math.min(28, new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate());
        for (let day = 1; day <= daysInMonth; day++) {
            // Food
            const foodMeals = ['Sarapan & Kopi', 'Makan Siang Tim', 'Makan Malam Keluarga', 'Snack Sore'];
            const mealCount = Math.floor(Math.random() * 2) + 1; // 1-2 times
            for (let i = 0; i < mealCount; i++) {
                demoTransactions.push({
                    id: `demo-food-${monthsAgo}-${day}-${i}`,
                    type: 'expense',
                    category: '101', // Makanan & Minuman
                    amount: Math.floor(Math.random() * 45000) + 20000,
                    date: new Date(month.getFullYear(), month.getMonth(), day).toISOString().split('T')[0],
                    note: foodMeals[(day + i) % foodMeals.length],
                    timestamp: new Date(month.getFullYear(), month.getMonth(), day, 8 + (i * 5), Math.floor(Math.random() * 50)).getTime()
                });
            }

            // Transport (weekday basis approx)
            if (day % 7 !== 0 && day % 7 !== 6 && Math.random() > 0.4) {
                demoTransactions.push({
                    id: `demo-transport-${monthsAgo}-${day}`,
                    type: 'expense',
                    category: '102', // Transport
                    amount: Math.floor(Math.random() * 30000) + 15000,
                    date: new Date(month.getFullYear(), month.getMonth(), day).toISOString().split('T')[0],
                    note: Math.random() > 0.5 ? 'Bensin Pertamax' : 'Ojek Online ke Kantor',
                    timestamp: new Date(month.getFullYear(), month.getMonth(), day, 7, 45).getTime()
                });
            }
        }

        // Monthly Bills
        demoTransactions.push({
            id: `demo-bill-electricity-${monthsAgo}`,
            type: 'expense',
            category: '104', // Tagihan
            amount: 450000,
            date: new Date(month.getFullYear(), month.getMonth(), 8).toISOString().split('T')[0],
            note: 'Tagihan Listrik PLN & Air PDAM',
            timestamp: new Date(month.getFullYear(), month.getMonth(), 8, 10, 0).getTime()
        });

        demoTransactions.push({
            id: `demo-bill-wifi-${monthsAgo}`,
            type: 'expense',
            category: '104', // Tagihan
            amount: 320000,
            date: new Date(month.getFullYear(), month.getMonth(), 10).toISOString().split('T')[0],
            note: 'Paket Internet Indihome & Netflix',
            timestamp: new Date(month.getFullYear(), month.getMonth(), 10, 10, 30).getTime()
        });

        // Shopping & Groceries (2 times per month)
        demoTransactions.push({
            id: `demo-shop-1-${monthsAgo}`,
            type: 'expense',
            category: '103', // Belanja
            amount: Math.floor(Math.random() * 300000) + 350000,
            date: new Date(month.getFullYear(), month.getMonth(), 5).toISOString().split('T')[0],
            note: 'Belanja Kebutuhan Pokok Supermarket',
            timestamp: new Date(month.getFullYear(), month.getMonth(), 5, 16, 0).getTime()
        });

        demoTransactions.push({
            id: `demo-shop-2-${monthsAgo}`,
            type: 'expense',
            category: '103', // Belanja
            amount: Math.floor(Math.random() * 200000) + 180000,
            date: new Date(month.getFullYear(), month.getMonth(), 20).toISOString().split('T')[0],
            note: 'Belanja Keperluan Rumah Tangga',
            timestamp: new Date(month.getFullYear(), month.getMonth(), 20, 15, 30).getTime()
        });

        // Entertainment / Hangout (1-2 times per month)
        demoTransactions.push({
            id: `demo-entertain-${monthsAgo}`,
            type: 'expense',
            category: '105', // Entertainment
            amount: Math.floor(Math.random() * 200000) + 150000,
            date: new Date(month.getFullYear(), month.getMonth(), 14).toISOString().split('T')[0],
            note: 'Nonton Bioskop & Makan Santai',
            timestamp: new Date(month.getFullYear(), month.getMonth(), 14, 19, 0).getTime()
        });

        // Health / Fitness
        if (monthsAgo % 2 === 1) {
            demoTransactions.push({
                id: `demo-health-${monthsAgo}`,
                type: 'expense',
                category: '106', // Kesehatan
                amount: 250000,
                date: new Date(month.getFullYear(), month.getMonth(), 12).toISOString().split('T')[0],
                note: 'Vitamin & Check-up Kesehatan',
                timestamp: new Date(month.getFullYear(), month.getMonth(), 12, 11, 0).getTime()
            });
        }
    }

    // Save demo data
    storage.saveTransactions(demoTransactions);
    
    // Set realistic daily budget
    storage.setDailyBudget(175000);

    // Show toast and reload
    if (window.app) {
        window.app.showToast(`Data demo berhasil dimuat! (${demoTransactions.length} transaksi)`, 'success');
        window.app.loadDashboard();
        if (window.app.currentPage === 'transactions') {
            window.app.loadTransactions();
        } else if (window.app.currentPage === 'categories') {
            window.app.loadCategories();
        } else if (window.app.currentPage === 'reports') {
            window.app.loadReports();
        } else if (window.app.currentPage === 'settings') {
            window.app.loadSettings();
        }
    }

    console.log(`Loaded ${demoTransactions.length} demo transactions`);
    return demoTransactions.length;
}

// Fungsi untuk clear demo data
function clearDemoData(skipConfirm = false) {
    if (!skipConfirm && !confirm('Hapus semua data demo?')) {
        return;
    }

    const transactions = storage.getAllTransactions();
    const demoTransactions = transactions.filter(t => t.id.startsWith('demo-'));
    
    demoTransactions.forEach(t => {
        storage.deleteTransaction(t.id);
    });

    if (window.app) {
        window.app.showToast(`${demoTransactions.length} transaksi demo berhasil dihapus!`, 'success');
        window.app.loadDashboard();
    }
}

// Export functions to global window
window.loadDemoData = loadDemoData;
window.clearDemoData = clearDemoData;
