// ========================================
// Local Storage Management
// ========================================

class StorageManager {
    constructor() {
        this.STORAGE_KEYS = {
            TRANSACTIONS: 'ngaturuang_transactions',
            CATEGORIES: 'ngaturuang_categories',
            BUDGET: 'ngaturuang_daily_budget',
            CLOUD_EMAIL: 'ngaturuang_cloud_email',
            LAST_SYNC: 'ngaturuang_last_sync'
        };
        
        this.initDefaultCategories();
    }

    // ========================================
    // Categories
    // ========================================
    initDefaultCategories() {
        if (!this.getCategories().length) {
            const defaultCategories = [
                // Income Categories
                { id: '1', type: 'income', name: 'Gaji Bulanan', icon: '💰', color: '#4CAF50' },
                { id: '2', type: 'income', name: 'Bonus', icon: '🎁', color: '#8BC34A' },
                { id: '3', type: 'income', name: 'Freelance', icon: '💼', color: '#CDDC39' },
                { id: '4', type: 'income', name: 'Investasi', icon: '📈', color: '#00BCD4' },
                { id: '5', type: 'income', name: 'Hadiah', icon: '🎉', color: '#03A9F4' },
                { id: '6', type: 'income', name: 'Penjualan', icon: '🏪', color: '#009688' },
                
                // Expense Categories
                { id: '101', type: 'expense', name: 'Makanan & Minuman', icon: '🍔', color: '#FF9800' },
                { id: '102', type: 'expense', name: 'Transport', icon: '🚗', color: '#FF5722' },
                { id: '103', type: 'expense', name: 'Belanja', icon: '🛒', color: '#E91E63' },
                { id: '104', type: 'expense', name: 'Tagihan', icon: '📱', color: '#9C27B0' },
                { id: '105', type: 'expense', name: 'Entertainment', icon: '🎬', color: '#673AB7' },
                { id: '106', type: 'expense', name: 'Kesehatan', icon: '🏥', color: '#3F51B5' },
                { id: '107', type: 'expense', name: 'Pendidikan', icon: '📚', color: '#2196F3' },
                { id: '108', type: 'expense', name: 'Olahraga', icon: '⚽', color: '#00BCD4' },
                { id: '109', type: 'expense', name: 'Pakaian', icon: '👕', color: '#009688' },
                { id: '110', type: 'expense', name: 'Kecantikan', icon: '💄', color: '#E91E63' },
                { id: '111', type: 'expense', name: 'Rumah Tangga', icon: '🏠', color: '#795548' },
                { id: '112', type: 'expense', name: 'Lain-lain', icon: '📦', color: '#607D8B' }
            ];
            
            this.saveCategories(defaultCategories);
        }
    }

    getCategories() {
        const data = localStorage.getItem(this.STORAGE_KEYS.CATEGORIES);
        return data ? JSON.parse(data) : [];
    }

    saveCategories(categories) {
        localStorage.setItem(this.STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    }

    getCategoryById(id) {
        return this.getCategories().find(cat => cat.id === id);
    }

    addCategory(category) {
        const categories = this.getCategories();
        categories.push(category);
        this.saveCategories(categories);
    }

    updateCategory(updatedCategory) {
        const categories = this.getCategories();
        const index = categories.findIndex(cat => cat.id === updatedCategory.id);
        if (index !== -1) {
            categories[index] = updatedCategory;
            this.saveCategories(categories);
        }
    }

    deleteCategory(id) {
        const categories = this.getCategories().filter(cat => cat.id !== id);
        this.saveCategories(categories);
    }

    // ========================================
    // Transactions
    // ========================================
    getAllTransactions() {
        const data = localStorage.getItem(this.STORAGE_KEYS.TRANSACTIONS);
        const transactions = data ? JSON.parse(data) : [];
        
        // Sort by date (newest first)
        return transactions.sort((a, b) => {
            const dateCompare = new Date(b.date) - new Date(a.date);
            if (dateCompare !== 0) return dateCompare;
            return b.timestamp - a.timestamp;
        });
    }

    saveTransactions(transactions) {
        localStorage.setItem(this.STORAGE_KEYS.TRANSACTIONS, JSON.stringify(transactions));
    }

    getTransactionById(id) {
        return this.getAllTransactions().find(t => t.id === id);
    }

    addTransaction(transaction) {
        const transactions = this.getAllTransactions();
        transactions.push(transaction);
        this.saveTransactions(transactions);
    }

    updateTransaction(updatedTransaction) {
        const transactions = this.getAllTransactions();
        const index = transactions.findIndex(t => t.id === updatedTransaction.id);
        if (index !== -1) {
            transactions[index] = updatedTransaction;
            this.saveTransactions(transactions);
        }
    }

    deleteTransaction(id) {
        const transactions = this.getAllTransactions().filter(t => t.id !== id);
        this.saveTransactions(transactions);
    }

    // ========================================
    // Filtered Transactions
    // ========================================
    getTransactionsByPeriod(period) {
        const transactions = this.getAllTransactions();
        const now = new Date();
        
        switch(period) {
            case 'daily':
                const today = now.toISOString().split('T')[0];
                return transactions.filter(t => t.date === today);
            
            case 'weekly':
                const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
                return transactions.filter(t => new Date(t.date) >= weekAgo);
            
            case 'monthly':
                const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);
                return transactions.filter(t => new Date(t.date) >= monthStart);
            
            case 'yearly':
                const yearStart = new Date(now.getFullYear(), 0, 1);
                return transactions.filter(t => new Date(t.date) >= yearStart);
            
            case 'all':
            default:
                return transactions;
        }
    }

    getTransactionsByDateRange(startDate, endDate) {
        const transactions = this.getAllTransactions();
        const start = new Date(startDate);
        const end = new Date(endDate);
        
        return transactions.filter(t => {
            const date = new Date(t.date);
            return date >= start && date <= end;
        });
    }

    // ========================================
    // Chart Data
    // ========================================
    getMonthlyExpenseData() {
        const months = [];
        const expenses = [];
        const income = [];
        const now = new Date();
        
        // Get last 6 months
        for (let i = 5; i >= 0; i--) {
            const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
            const monthName = date.toLocaleDateString('id-ID', { month: 'short', year: '2-digit' });
            months.push(monthName);
            
            const monthTransactions = this.getAllTransactions().filter(t => {
                const tDate = new Date(t.date);
                return tDate.getMonth() === date.getMonth() && 
                       tDate.getFullYear() === date.getFullYear();
            });
            
            const monthExpense = monthTransactions
                .filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + t.amount, 0);
            
            const monthIncome = monthTransactions
                .filter(t => t.type === 'income')
                .reduce((sum, t) => sum + t.amount, 0);
            
            expenses.push(monthExpense);
            income.push(monthIncome);
        }
        
        return { labels: months, expenses, income };
    }

    getCategoryExpenseData() {
        const transactions = this.getTransactionsByPeriod('monthly');
        const expenseTransactions = transactions.filter(t => t.type === 'expense');
        
        if (expenseTransactions.length === 0) {
            return { labels: [], amounts: [], colors: [] };
        }
        
        const categoryTotals = {};
        
        expenseTransactions.forEach(t => {
            const category = this.getCategoryById(t.category);
            if (category) {
                if (!categoryTotals[category.id]) {
                    categoryTotals[category.id] = {
                        name: category.name,
                        amount: 0,
                        color: category.color
                    };
                }
                categoryTotals[category.id].amount += t.amount;
            }
        });
        
        const sortedCategories = Object.values(categoryTotals)
            .sort((a, b) => b.amount - a.amount);
        
        return {
            labels: sortedCategories.map(c => c.name),
            amounts: sortedCategories.map(c => c.amount),
            colors: sortedCategories.map(c => c.color)
        };
    }

    // ========================================
    // Budget
    // ========================================
    getDailyBudget() {
        const budget = localStorage.getItem(this.STORAGE_KEYS.BUDGET);
        return budget ? parseFloat(budget) : 0;
    }

    setDailyBudget(budget) {
        localStorage.setItem(this.STORAGE_KEYS.BUDGET, budget.toString());
    }

    // ========================================
    // Cloud Settings
    // ========================================
    getCloudEmail() {
        return localStorage.getItem(this.STORAGE_KEYS.CLOUD_EMAIL);
    }

    setCloudEmail(email) {
        localStorage.setItem(this.STORAGE_KEYS.CLOUD_EMAIL, email);
    }

    getLastSyncTime() {
        const time = localStorage.getItem(this.STORAGE_KEYS.LAST_SYNC);
        return time ? parseInt(time) : null;
    }

    setLastSyncTime(timestamp) {
        localStorage.setItem(this.STORAGE_KEYS.LAST_SYNC, timestamp.toString());
    }

    // ========================================
    // Data Export/Import
    // ========================================
    exportData(format = 'pdf', period = 'all', customStart = null, customEnd = null) {
        if (typeof exportManager !== 'undefined') {
            exportManager.exportFinancialData(format, period, customStart, customEnd);
        } else {
            console.error('ExportManager is not loaded.');
        }
    }

    exportToPDF(startDate = null, endDate = null) {
        if (typeof exportManager !== 'undefined') {
            exportManager.exportToPDF(startDate, endDate);
        }
    }

    exportToExcel(startDate = null, endDate = null) {
        if (typeof exportManager !== 'undefined') {
            exportManager.exportToExcel(startDate, endDate);
        }
    }

    async importData(file) {
        if (!file) return;
        
        try {
            const text = await file.text();
            const data = JSON.parse(text);
            
            if (!data.version || !data.transactions || !data.categories) {
                throw new Error('Format file tidak valid');
            }
            
            // Confirm import
            if (!confirm('Import data akan menggantikan data yang ada. Lanjutkan?')) {
                return;
            }
            
            // Import data
            this.saveTransactions(data.transactions);
            this.saveCategories(data.categories);
            
            if (data.budget) {
                this.setDailyBudget(data.budget);
            }
            
            if (data.cloudEmail) {
                this.setCloudEmail(data.cloudEmail);
            }
            
            if (window.app) {
                window.app.showToast('Data berhasil diimport!', 'success');
                window.app.loadDashboard();
            }
        } catch (error) {
            console.error('Import error:', error);
            if (window.app) {
                window.app.showToast('Gagal import data: ' + error.message, 'error');
            }
        }
    }

    clearAllData() {
        localStorage.removeItem(this.STORAGE_KEYS.TRANSACTIONS);
        localStorage.removeItem(this.STORAGE_KEYS.CATEGORIES);
        localStorage.removeItem(this.STORAGE_KEYS.BUDGET);
        localStorage.removeItem(this.STORAGE_KEYS.CLOUD_EMAIL);
        localStorage.removeItem(this.STORAGE_KEYS.LAST_SYNC);
        
        // Reinit default categories
        this.initDefaultCategories();
    }

    // ========================================
    // Statistics
    // ========================================
    getStatistics(period = 'monthly') {
        const transactions = this.getTransactionsByPeriod(period);
        
        const totalIncome = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const totalExpense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = totalIncome - totalExpense;
        
        const transactionCount = transactions.length;
        const averageExpense = transactionCount > 0 ? 
            totalExpense / transactions.filter(t => t.type === 'expense').length : 0;
        
        return {
            totalIncome,
            totalExpense,
            balance,
            transactionCount,
            averageExpense
        };
    }
}

// Create global storage instance
const storage = new StorageManager();
