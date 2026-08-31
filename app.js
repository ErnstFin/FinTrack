// ==========================================================================
// FinTrack - Modern Financial Management Main Application Controller
// ==========================================================================

class FinanceApp {
    constructor() {
        this.currentPage = 'dashboard';
        this.charts = {};
        this.isBalanceHidden = false;
        this.confirmResolve = null;
        this.toastTimeout = null;
        this.init();
    }

    init() {
        this.initTheme();
        this.initPrivacy();
        this.initNavigation();
        this.initModals();
        this.initForms();
        this.initEventListeners();
        this.initCategoryTabs();
        this.initReportsPresets();
        this.loadDashboard();
        this.checkDailyBudget();
        this.updateDashboardGreeting();
    }

    // ==========================================================================
    // Theme Management (Dark & Light Mode)
    // ==========================================================================
    initTheme() {
        const savedTheme = localStorage.getItem('theme');
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        
        if (savedTheme) {
            document.documentElement.setAttribute('data-theme', savedTheme);
        } else if (prefersDark) {
            document.documentElement.setAttribute('data-theme', 'dark');
        }

        this.updateThemeUI();

        // Listen for system theme preference changes
        window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
            if (!localStorage.getItem('theme')) {
                document.documentElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
                this.updateThemeUI();
                this.refreshCurrentCharts();
            }
        });
    }

    toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme') || 'light';
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        document.documentElement.setAttribute('data-theme', newTheme);
        localStorage.setItem('theme', newTheme);
        this.updateThemeUI();
        this.refreshCurrentCharts();
    }

    updateThemeUI() {
        const theme = document.documentElement.getAttribute('data-theme');
        const isDark = theme === 'dark';
        
        const themeIcons = document.querySelectorAll('.theme-icon');
        themeIcons.forEach(icon => {
            icon.textContent = isDark ? '☀️' : '🌙';
        });

        const settingsThemeSwitch = document.getElementById('settingsThemeSwitch');
        if (settingsThemeSwitch) {
            settingsThemeSwitch.checked = isDark;
        }

        const settingsLabel = document.getElementById('settingsThemeLabel');
        if (settingsLabel) {
            settingsLabel.textContent = isDark ? 'Mode Terang' : 'Mode Gelap';
        }
    }

    refreshCurrentCharts() {
        if (this.currentPage === 'dashboard') {
            this.loadMonthlyExpenseChart();
            this.loadCategoryChart();
        }
    }

    // ==========================================================================
    // Privacy Mode (Hide / Show Balances)
    // ==========================================================================
    initPrivacy() {
        this.isBalanceHidden = localStorage.getItem('ngaturuang_hide_balance') === 'true';
        this.updatePrivacyUI();
    }

    togglePrivacy() {
        this.isBalanceHidden = !this.isBalanceHidden;
        localStorage.setItem('ngaturuang_hide_balance', this.isBalanceHidden.toString());
        this.updatePrivacyUI();
        if (this.currentPage === 'dashboard') {
            this.loadDashboard();
        } else if (this.currentPage === 'transactions') {
            this.loadTransactions();
        }
    }

    updatePrivacyUI() {
        const eyeIcon = document.getElementById('eyeIcon');
        if (eyeIcon) {
            if (this.isBalanceHidden) {
                eyeIcon.innerHTML = `
                    <path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/>
                    <path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/>
                    <path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/>
                    <line x1="2" x2="22" y1="2" y2="22"/>
                `;
            } else {
                eyeIcon.innerHTML = `
                    <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/>
                    <circle cx="12" cy="12" r="3"/>
                `;
            }
        }

        const settingsPrivacySwitch = document.getElementById('settingsPrivacySwitch');
        if (settingsPrivacySwitch) {
            settingsPrivacySwitch.checked = this.isBalanceHidden;
        }

        const settingsPrivacyLabel = document.getElementById('settingsPrivacyLabel');
        if (settingsPrivacyLabel) {
            settingsPrivacyLabel.textContent = this.isBalanceHidden ? 'Tampilkan' : 'Sembunyikan';
        }
    }

    // ==========================================================================
    // Navigation
    // ==========================================================================
    initNavigation() {
        const navButtons = document.querySelectorAll('.nav-btn');
        navButtons.forEach(btn => {
            btn.addEventListener('click', () => {
                const page = btn.dataset.page;
                if (page) this.navigateTo(page);
            });
        });

        // Logo click goes to dashboard
        document.getElementById('logoBtn')?.addEventListener('click', (e) => {
            e.preventDefault();
            this.navigateTo('dashboard');
        });

        // "See All" link on recent transactions
        document.getElementById('seeAllTransactionsBtn')?.addEventListener('click', () => {
            this.navigateTo('transactions');
        });
    }

    navigateTo(page) {
        // Update active nav button (both desktop and mobile)
        document.querySelectorAll('.nav-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.page === page);
        });

        // Show active page container
        document.querySelectorAll('.page').forEach(p => {
            p.classList.toggle('active', p.id === `${page}-page`);
        });

        this.currentPage = page;
        window.scrollTo({ top: 0, behavior: 'smooth' });

        // Load page specific data
        switch(page) {
            case 'dashboard':
                this.loadDashboard();
                this.checkDailyBudget();
                break;
            case 'transactions':
                this.loadTransactions();
                break;
            case 'categories':
                this.loadCategories();
                break;
            case 'reports':
                this.loadReports();
                break;
            case 'settings':
                this.loadSettings();
                break;
        }
    }

    // ==========================================================================
    // Modals & Custom Confirmation Dialog
    // ==========================================================================
    initModals() {
        // Open transaction modal buttons
        document.getElementById('addTransactionBtn')?.addEventListener('click', () => this.openTransactionModal());
        document.getElementById('addTransactionBtn2')?.addEventListener('click', () => this.openTransactionModal());
        document.getElementById('mobileFab')?.addEventListener('click', () => this.openTransactionModal());

        // Open category modal button
        document.getElementById('addCategoryBtn')?.addEventListener('click', () => this.openCategoryModal());

        // Modal close buttons
        document.querySelectorAll('.modal-close, .modal-cancel').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modal = e.target.closest('.modal');
                if (modal) this.closeModal(modal.id);
            });
        });

        // Outside click to close modal
        window.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal') && e.target.id !== 'confirmModal') {
                this.closeModal(e.target.id);
            }
        });

        // Escape key to close modal
        window.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                const activeModal = document.querySelector('.modal.active');
                if (activeModal && activeModal.id !== 'confirmModal') {
                    this.closeModal(activeModal.id);
                }
            }
        });

        // Custom Confirm Dialog Actions
        document.getElementById('confirmCancelBtn')?.addEventListener('click', () => {
            this.closeModal('confirmModal');
            if (this.confirmResolve) this.confirmResolve(false);
        });

        document.getElementById('confirmOkBtn')?.addEventListener('click', () => {
            this.closeModal('confirmModal');
            if (this.confirmResolve) this.confirmResolve(true);
        });
    }

    showConfirm(title, message, okText = 'Lanjutkan', isDanger = true, icon = '⚠️') {
        return new Promise((resolve) => {
            this.confirmResolve = resolve;
            const modal = document.getElementById('confirmModal');
            document.getElementById('confirmTitle').textContent = title;
            document.getElementById('confirmMessage').textContent = message;
            document.getElementById('confirmIcon').textContent = icon;
            
            const okBtn = document.getElementById('confirmOkBtn');
            okBtn.textContent = okText;
            okBtn.className = isDanger ? 'btn btn-danger' : 'btn btn-primary';

            modal.classList.add('active');
        });
    }

    openTransactionModal(transaction = null) {
        const modal = document.getElementById('transactionModal');
        const form = document.getElementById('transactionForm');
        const title = document.getElementById('transactionModalTitle');
        const submitBtn = document.getElementById('saveTransactionSubmitBtn');
        
        form.reset();
        
        if (transaction) {
            title.textContent = 'Edit Transaksi';
            submitBtn.textContent = 'Simpan Perubahan';
            document.getElementById('transactionId').value = transaction.id;
            document.getElementById('transactionType').value = transaction.type;
            this.setTransactionTypeUI(transaction.type);
            this.updateCategoryOptions();
            document.getElementById('transactionCategory').value = transaction.category;
            document.getElementById('transactionAmount').value = transaction.amount;
            document.getElementById('transactionDate').value = transaction.date;
            document.getElementById('transactionNote').value = transaction.note || '';
            this.updateAmountPreview(transaction.amount);
        } else {
            title.textContent = 'Tambah Transaksi';
            submitBtn.textContent = 'Simpan Transaksi';
            document.getElementById('transactionId').value = '';
            document.getElementById('transactionType').value = 'expense';
            this.setTransactionTypeUI('expense');
            this.updateCategoryOptions();
            document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
            document.getElementById('transactionAmount').value = '';
            this.updateAmountPreview(0);
        }
        
        modal.classList.add('active');
        setTimeout(() => document.getElementById('transactionAmount').focus(), 100);
    }

    setTransactionTypeUI(type) {
        document.querySelectorAll('.type-select-btn').forEach(btn => {
            btn.classList.toggle('active', btn.dataset.type === type);
        });
        document.getElementById('transactionType').value = type;
        this.updateCategoryOptions();
    }

    openCategoryModal(category = null) {
        const modal = document.getElementById('categoryModal');
        const form = document.getElementById('categoryForm');
        const title = document.getElementById('categoryModalTitle');
        
        form.reset();
        
        if (category) {
            title.textContent = 'Edit Kategori';
            document.getElementById('categoryId').value = category.id;
            document.getElementById('categoryType').value = category.type;
            document.getElementById('categoryName').value = category.name;
            document.getElementById('categoryIcon').value = category.icon;
            document.getElementById('categoryColor').value = category.color;
        } else {
            title.textContent = 'Tambah Kategori Baru';
            document.getElementById('categoryId').value = '';
            document.getElementById('categoryType').value = 'expense';
            document.getElementById('categoryColor').value = '#10b981';
            document.getElementById('categoryIcon').value = '💰';
        }
        
        modal.classList.add('active');
        setTimeout(() => document.getElementById('categoryName').focus(), 100);
    }

    openExportModal() {
        const modal = document.getElementById('exportFinanceModal');
        if (!modal) return;

        // Reset inputs
        const periodSelect = document.getElementById('exportSelectedPeriod');
        if (periodSelect) periodSelect.value = 'all';
        document.getElementById('exportCustomDateRange')?.classList.add('hidden');

        // Set default dates if needed
        const now = new Date().toISOString().split('T')[0];
        const startDateInput = document.getElementById('exportCustomStartDate');
        const endDateInput = document.getElementById('exportCustomEndDate');
        if (startDateInput && !startDateInput.value) startDateInput.value = now;
        if (endDateInput && !endDateInput.value) endDateInput.value = now;

        modal.classList.add('active');
    }

    closeModal(modalId) {
        document.getElementById(modalId)?.classList.remove('active');
    }

    // ==========================================================================
    // Forms & Interactive Inputs
    // ==========================================================================
    initForms() {
        // Transaction Form Submission
        document.getElementById('transactionForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveTransaction();
        });

        // Category Form Submission
        document.getElementById('categoryForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            this.saveCategory();
        });

        // Transaction Type Segmented Toggle inside modal
        document.querySelectorAll('.type-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const type = btn.dataset.type;
                this.setTransactionTypeUI(type);
            });
        });

        // Live Amount Spelled Helper & Formatting
        const amountInput = document.getElementById('transactionAmount');
        amountInput?.addEventListener('input', () => {
            const val = parseFloat(amountInput.value) || 0;
            this.updateAmountPreview(val);
        });

        // Quick Amount Presets (+10rb, +20rb, +50rb, etc.)
        document.querySelectorAll('.quick-amount-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const addVal = parseFloat(btn.dataset.add) || 0;
                const currentVal = parseFloat(amountInput.value) || 0;
                amountInput.value = currentVal + addVal;
                this.updateAmountPreview(currentVal + addVal);
            });
        });

        // Date Shortcuts (Hari ini / Kemarin)
        document.getElementById('shortcutDateToday')?.addEventListener('click', () => {
            document.getElementById('transactionDate').value = new Date().toISOString().split('T')[0];
        });

        document.getElementById('shortcutDateYesterday')?.addEventListener('click', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            document.getElementById('transactionDate').value = yesterday.toISOString().split('T')[0];
        });

        // Category Modal Emoji Presets
        document.querySelectorAll('.emoji-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.getElementById('categoryIcon').value = btn.textContent.trim();
            });
        });

        // Category Modal Color Presets
        document.querySelectorAll('.color-dot').forEach(dot => {
            dot.addEventListener('click', () => {
                const color = dot.dataset.color;
                document.getElementById('categoryColor').value = color;
            });
        });
    }

    updateAmountPreview(amount) {
        const helper = document.getElementById('amountSpelledHelper');
        if (!helper) return;

        if (!amount || amount <= 0) {
            helper.textContent = 'Masukkan nominal transaksi';
            helper.style.opacity = '0.7';
            return;
        }

        helper.style.opacity = '1';
        helper.textContent = `Rp ${amount.toLocaleString('id-ID')} • ${this.terbilang(amount)}`;
    }

    terbilang(angka) {
        if (angka === 0) return "Nol Rupiah";
        const bilangan = ["", "Satu", "Dua", "Tiga", "Empat", "Lima", "Enam", "Tujuh", "Delapan", "Sembilan", "Sepuluh", "Sebelas"];
        
        let hasil = "";
        if (angka < 12) {
            hasil = bilangan[angka];
        } else if (angka < 20) {
            hasil = this.terbilang(angka - 10) + " Belas";
        } else if (angka < 100) {
            hasil = this.terbilang(Math.floor(angka / 10)) + " Puluh " + this.terbilang(angka % 10);
        } else if (angka < 200) {
            hasil = "Seratus " + this.terbilang(angka - 100);
        } else if (angka < 1000) {
            hasil = this.terbilang(Math.floor(angka / 100)) + " Ratus " + this.terbilang(angka % 100);
        } else if (angka < 2000) {
            hasil = "Seribu " + this.terbilang(angka - 1000);
        } else if (angka < 1000000) {
            hasil = this.terbilang(Math.floor(angka / 1000)) + " Ribu " + this.terbilang(angka % 1000);
        } else if (angka < 1000000000) {
            hasil = this.terbilang(Math.floor(angka / 1000000)) + " Juta " + this.terbilang(angka % 1000000);
        } else if (angka < 1000000000000) {
            hasil = this.terbilang(Math.floor(angka / 1000000000)) + " Miliar " + this.terbilang(angka % 1000000000);
        } else {
            hasil = "Nominal Sangat Besar";
        }
        
        return hasil.replace(/\s+/g, ' ').trim() + " Rupiah";
    }

    updateCategoryOptions() {
        const type = document.getElementById('transactionType').value;
        const categorySelect = document.getElementById('transactionCategory');
        const categories = storage.getCategories().filter(cat => cat.type === type);
        
        categorySelect.innerHTML = '<option value="">Pilih Kategori</option>';
        
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.icon} ${cat.name}`;
            categorySelect.appendChild(option);
        });
    }

    saveTransaction() {
        const id = document.getElementById('transactionId').value;
        const amount = parseFloat(document.getElementById('transactionAmount').value);
        const category = document.getElementById('transactionCategory').value;
        const date = document.getElementById('transactionDate').value;
        const type = document.getElementById('transactionType').value;
        const note = document.getElementById('transactionNote').value.trim();

        if (!category) {
            this.showToast('Silakan pilih kategori terlebih dahulu', 'warning');
            return;
        }

        if (!amount || amount <= 0) {
            this.showToast('Nominal transaksi harus lebih dari Rp 0', 'warning');
            return;
        }

        const transaction = {
            id: id || `tx-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
            type: type,
            category: category,
            amount: amount,
            date: date,
            note: note,
            timestamp: Date.now()
        };

        if (id) {
            storage.updateTransaction(transaction);
            this.showToast('Transaksi berhasil diperbarui!', 'success');
        } else {
            storage.addTransaction(transaction);
            this.showToast('Transaksi berhasil dicatat!', 'success');
        }

        this.closeModal('transactionModal');
        this.loadDashboard();
        if (this.currentPage === 'transactions') {
            this.loadTransactions();
        }
        this.checkDailyBudget();
        cloudSync.syncToCloud();
    }

    saveCategory() {
        const id = document.getElementById('categoryId').value;
        const category = {
            id: id || `cat-${Date.now()}`,
            type: document.getElementById('categoryType').value,
            name: document.getElementById('categoryName').value.trim(),
            icon: document.getElementById('categoryIcon').value.trim() || '💰',
            color: document.getElementById('categoryColor').value
        };

        if (!category.name) {
            this.showToast('Nama kategori tidak boleh kosong', 'warning');
            return;
        }

        if (id) {
            storage.updateCategory(category);
            this.showToast('Kategori berhasil diperbarui!', 'success');
        } else {
            storage.addCategory(category);
            this.showToast('Kategori baru berhasil ditambahkan!', 'success');
        }

        this.closeModal('categoryModal');
        this.loadCategories();
        cloudSync.syncToCloud();
    }

    // ==========================================================================
    // Event Listeners Initialization
    // ==========================================================================
    initEventListeners() {
        // Theme Toggle (Header & Settings switch/button)
        document.getElementById('themeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('settingsThemeToggle')?.addEventListener('click', () => this.toggleTheme());
        document.getElementById('settingsThemeSwitch')?.addEventListener('change', () => this.toggleTheme());

        // Privacy Toggle (Dashboard Eye & Settings switch/button)
        document.getElementById('toggleBalancePrivacy')?.addEventListener('click', () => this.togglePrivacy());
        document.getElementById('settingsPrivacyToggle')?.addEventListener('click', () => this.togglePrivacy());
        document.getElementById('settingsPrivacySwitch')?.addEventListener('change', () => this.togglePrivacy());

        // Cloud Sync Buttons
        document.getElementById('syncBtn')?.addEventListener('click', () => cloudSync.syncToCloud());
        document.getElementById('connectCloudBtn')?.addEventListener('click', () => cloudSync.connect());

        // Dashboard Period Segmented Control
        document.querySelectorAll('.segmented-control .segment-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.segmented-control .segment-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const period = btn.dataset.period;
                document.getElementById('periodSelect').value = period;
                this.loadDashboard();
            });
        });

        // Transactions Real-time Search & Filters
        const searchInput = document.getElementById('searchTransactionInput');
        const clearSearchBtn = document.getElementById('clearSearchBtn');

        searchInput?.addEventListener('input', () => {
            const hasVal = searchInput.value.trim().length > 0;
            clearSearchBtn?.classList.toggle('hidden', !hasVal);
            this.loadTransactions();
        });

        clearSearchBtn?.addEventListener('click', () => {
            searchInput.value = '';
            clearSearchBtn.classList.add('hidden');
            searchInput.focus();
            this.loadTransactions();
        });

        // Transaction Type Filter Pills
        document.querySelectorAll('.type-filter-pills .pill-btn').forEach(pill => {
            pill.addEventListener('click', () => {
                document.querySelectorAll('.type-filter-pills .pill-btn').forEach(p => p.classList.remove('active'));
                pill.classList.add('active');
                document.getElementById('filterType').value = pill.dataset.type;
                this.loadTransactions();
            });
        });

        document.getElementById('filterCategory')?.addEventListener('change', () => this.loadTransactions());
        document.getElementById('sortTransactions')?.addEventListener('change', () => this.loadTransactions());

        // Reports Export Buttons
        document.getElementById('generateReportBtn')?.addEventListener('click', () => this.generateReport());
        document.getElementById('exportPdfBtn')?.addEventListener('click', () => {
            const startDate = document.getElementById('reportStartDate')?.value || null;
            const endDate = document.getElementById('reportEndDate')?.value || null;
            exportManager.exportToPDF(startDate, endDate);
        });
        document.getElementById('exportExcelBtn')?.addEventListener('click', () => {
            const startDate = document.getElementById('reportStartDate')?.value || null;
            const endDate = document.getElementById('reportEndDate')?.value || null;
            exportManager.exportToExcel(startDate, endDate);
        });

        // Settings Data & Export Actions
        document.getElementById('saveBudgetBtn')?.addEventListener('click', () => this.saveDailyBudget());
        
        // Export Finance Modal Trigger
        document.getElementById('openExportFinanceModalBtn')?.addEventListener('click', () => this.openExportModal());

        // Export Modal Format Selector
        document.querySelectorAll('.format-select-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                document.querySelectorAll('.format-select-btn').forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                const format = btn.dataset.format;
                const formatInput = document.getElementById('exportSelectedFormat');
                if (formatInput) formatInput.value = format;
                
                const desc = document.getElementById('exportFormatDescription');
                if (desc) {
                    if (format === 'xlsx') {
                        desc.innerHTML = 'Format <strong>Excel (.xlsx)</strong> menghasilkan spreadsheet interaktif multi-sheet (Ringkasan, Daftar Transaksi, dan Analisis Kategori) siap olah.';
                    } else {
                        desc.innerHTML = 'Format <strong>PDF</strong> menghasilkan laporan formal siap cetak dengan ringkasan arus kas, tabel rincian transaksi, dan breakdown per kategori.';
                    }
                }
            });
        });

        // Export Modal Period Change
        document.getElementById('exportSelectedPeriod')?.addEventListener('change', (e) => {
            const isCustom = e.target.value === 'custom';
            document.getElementById('exportCustomDateRange')?.classList.toggle('hidden', !isCustom);
        });

        // Export Modal Form Submit
        document.getElementById('exportFinanceForm')?.addEventListener('submit', (e) => {
            e.preventDefault();
            const format = document.getElementById('exportSelectedFormat')?.value || 'pdf';
            const period = document.getElementById('exportSelectedPeriod')?.value || 'all';
            const customStart = document.getElementById('exportCustomStartDate')?.value || null;
            const customEnd = document.getElementById('exportCustomEndDate')?.value || null;

            exportManager.exportFinancialData(format, period, customStart, customEnd);
            this.closeModal('exportFinanceModal');
        });

        // Quick Demo Data Load (Header & Settings)
        const triggerDemoLoad = async () => {
            const confirmed = await this.showConfirm(
                'Muat Data Demo 6 Bulan?',
                'Aplikasi akan memuat sampel transaksi realistis 6 bulan terakhir untuk demonstrasi visual grafik & analitik modern.',
                'Muat Data Demo',
                false,
                '⚡'
            );
            if (confirmed && window.loadDemoData) {
                window.loadDemoData(true);
            }
        };

        document.getElementById('quickDemoBtn')?.addEventListener('click', triggerDemoLoad);
        document.getElementById('loadDemoDataBtn')?.addEventListener('click', triggerDemoLoad);

        // Clear All Data
        document.getElementById('clearDataBtn')?.addEventListener('click', async () => {
            const confirmed = await this.showConfirm(
                'Hapus Seluruh Data?',
                'Semua transaksi dan kategori yang tersimpan di browser akan dihapus secara permanen. Tindakan ini tidak dapat dibatalkan.',
                'Hapus Sekarang',
                true,
                '🗑️'
            );
            if (confirmed) {
                storage.clearAllData();
                this.showToast('Semua data berhasil dibersihkan!', 'success');
                this.loadDashboard();
            }
        });
    }

    // ==========================================================================
    // Dashboard Logic & Financial Insights
    // ==========================================================================
    updateDashboardGreeting() {
        const greetingElem = document.getElementById('dashboardDateGreeting');
        if (!greetingElem) return;

        const now = new Date();
        const hour = now.getHours();
        let greeting = 'Selamat Pagi';
        if (hour >= 12 && hour < 15) greeting = 'Selamat Siang';
        else if (hour >= 15 && hour < 18) greeting = 'Selamat Sore';
        else if (hour >= 18) greeting = 'Selamat Malam';

        const options = { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' };
        greetingElem.textContent = `${greeting} • ${now.toLocaleDateString('id-ID', options)}`;
    }

    loadDashboard() {
        const period = document.getElementById('periodSelect')?.value || 'monthly';
        const transactions = storage.getTransactionsByPeriod(period);
        
        // Calculate totals
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = income - expense;

        const incomeCount = transactions.filter(t => t.type === 'income').length;
        const expenseCount = transactions.filter(t => t.type === 'expense').length;

        // Update cards
        document.getElementById('totalBalance').textContent = this.isBalanceHidden ? '••••••••' : this.formatCurrency(balance);
        document.getElementById('totalIncome').textContent = this.isBalanceHidden ? '••••••••' : this.formatCurrency(income);
        document.getElementById('totalExpense').textContent = this.isBalanceHidden ? '••••••••' : this.formatCurrency(expense);

        document.getElementById('incomeCountMeta').textContent = `${incomeCount} transaksi masuk`;
        document.getElementById('expenseCountMeta').textContent = `${expenseCount} transaksi keluar`;

        // Update Cashflow Status Badge
        this.updateCashflowBadge(income, expense);

        // Update Financial Insights Quick Strip
        this.updateFinancialInsights(transactions, period, income, expense);

        // Update Charts
        this.loadMonthlyExpenseChart();
        this.loadCategoryChart();

        // Load Recent List
        this.loadRecentTransactions();
    }

    updateCashflowBadge(income, expense) {
        const statusBadge = document.getElementById('cashflowStatusBadge');
        const statusText = document.getElementById('cashflowStatusText');
        if (!statusBadge || !statusText) return;

        if (income === 0 && expense === 0) {
            statusText.textContent = 'Belum ada data transaksi';
            statusBadge.style.color = 'var(--text-muted)';
        } else if (income > expense) {
            const savingsRate = Math.round(((income - expense) / income) * 100);
            statusText.textContent = `Arus Kas Positif (+${savingsRate}% tabungan)`;
            statusBadge.style.color = 'var(--color-income)';
        } else if (expense > income) {
            statusText.textContent = 'Pengeluaran melebihi pemasukan';
            statusBadge.style.color = 'var(--color-expense)';
        } else {
            statusText.textContent = 'Arus Kas Seimbang (Impas)';
            statusBadge.style.color = 'var(--color-warning)';
        }
    }

    updateFinancialInsights(transactions, period, income, expense) {
        const dailyAvgElem = document.getElementById('insightDailyAvg');
        const savingsRateElem = document.getElementById('insightSavingsRate');
        const topCatElem = document.getElementById('insightTopCat');

        // 1. Calculate Daily Average Expense
        let days = 30;
        if (period === 'daily') days = 1;
        else if (period === 'weekly') days = 7;
        else if (period === 'monthly') days = 30;
        else if (period === 'yearly') days = 365;
        else {
            // all
            const allT = storage.getAllTransactions();
            if (allT.length > 1) {
                const dates = allT.map(t => new Date(t.date).getTime());
                const minDate = Math.min(...dates);
                const maxDate = Math.max(...dates);
                days = Math.max(1, Math.ceil((maxDate - minDate) / (1000 * 60 * 60 * 24)));
            } else {
                days = 1;
            }
        }
        const dailyAvg = Math.round(expense / days);
        if (dailyAvgElem) {
            dailyAvgElem.textContent = this.isBalanceHidden ? '••••••' : `${this.formatCurrency(dailyAvg)}/hari`;
        }

        // 2. Savings Rate
        if (savingsRateElem) {
            if (income > 0) {
                const rate = Math.round(((income - expense) / income) * 100);
                savingsRateElem.textContent = `${rate >= 0 ? '+' : ''}${rate}%`;
                savingsRateElem.style.color = rate >= 0 ? 'var(--color-income)' : 'var(--color-expense)';
            } else {
                savingsRateElem.textContent = '0%';
                savingsRateElem.style.color = 'var(--text-muted)';
            }
        }

        // 3. Top Spending Category
        if (topCatElem) {
            const expenseMap = {};
            transactions.filter(t => t.type === 'expense').forEach(t => {
                expenseMap[t.category] = (expenseMap[t.category] || 0) + t.amount;
            });

            const topEntry = Object.entries(expenseMap).sort((a, b) => b[1] - a[1])[0];
            if (topEntry) {
                const cat = storage.getCategoryById(topEntry[0]);
                topCatElem.textContent = `${cat?.icon || '🏷️'} ${cat?.name || 'Kategori'}`;
            } else {
                topCatElem.textContent = '-';
            }
        }
    }

    // ==========================================================================
    // Budget Monitoring Logic
    // ==========================================================================
    checkDailyBudget() {
        const budget = storage.getDailyBudget();
        const today = new Date().toISOString().split('T')[0];
        const todayExpenses = storage.getAllTransactions()
            .filter(t => t.type === 'expense' && t.date === today)
            .reduce((sum, t) => sum + t.amount, 0);

        const fill = document.getElementById('budgetProgressFill');
        const statusPill = document.getElementById('budgetStatusPill');
        const statusLabel = document.getElementById('budgetStatusLabel');
        const alert = document.getElementById('budgetAlert');
        const spentElem = document.getElementById('todaySpentValue');
        const budgetElem = document.getElementById('dailyBudgetValue');
        const remainingElem = document.getElementById('remainingBudgetValue');

        spentElem.textContent = this.isBalanceHidden ? '••••••' : this.formatCurrency(todayExpenses);

        if (!budget || budget <= 0) {
            budgetElem.textContent = 'Belum diatur';
            remainingElem.textContent = '-';
            fill.style.width = '0%';
            statusLabel.textContent = 'Belum Diatur';
            statusPill.className = 'budget-status-pill';
            alert?.classList.add('hidden');
            return;
        }

        budgetElem.textContent = this.isBalanceHidden ? '••••••' : this.formatCurrency(budget);
        const remaining = budget - todayExpenses;
        remainingElem.textContent = this.isBalanceHidden ? '••••••' : this.formatCurrency(Math.max(0, remaining));

        const percentage = Math.min(100, Math.round((todayExpenses / budget) * 100));
        fill.style.width = `${percentage}%`;

        fill.className = 'budget-progress-fill';
        statusPill.className = 'budget-status-pill';

        if (todayExpenses > budget) {
            fill.classList.add('danger');
            statusPill.classList.add('status-danger');
            statusLabel.textContent = `Overbudget (${Math.round((todayExpenses/budget)*100)}%)`;

            if (alert) {
                alert.classList.remove('hidden');
                alert.className = 'alert alert-warning';
                alert.querySelector('.alert-message').textContent = 
                    `Pengeluaran hari ini telah melampaui limit anggaran sebesar ${this.formatCurrency(todayExpenses - budget)}!`;
            }
        } else if (percentage >= 80) {
            fill.classList.add('warning');
            statusPill.classList.add('status-warning');
            statusLabel.textContent = `Hati-hati (${percentage}%)`;

            if (alert) {
                alert.classList.remove('hidden');
                alert.className = 'alert alert-warning';
                alert.querySelector('.alert-message').textContent = 
                    `Pengeluaran hari ini sudah mencapai ${percentage}% dari batas anggaran. Sisa dana: ${this.formatCurrency(remaining)}.`;
            }
        } else {
            statusPill.classList.add('status-safe');
            statusLabel.textContent = `Aman (${percentage}%)`;
            alert?.classList.add('hidden');
        }
    }

    // ==========================================================================
    // Chart.js Visualizations
    // ==========================================================================
    loadMonthlyExpenseChart() {
        const canvas = document.getElementById('monthlyExpenseChart');
        if (!canvas) return;
        
        const monthlyData = storage.getMonthlyExpenseData();
        if (this.charts.monthlyExpense) {
            this.charts.monthlyExpense.destroy();
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#94a3b8' : '#64748b';
        const gridColor = isDark ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.05)';

        const ctx = canvas.getContext('2d');
        
        // Income lush gradient
        const incomeGradient = ctx.createLinearGradient(0, 0, 0, 270);
        incomeGradient.addColorStop(0, 'rgba(16, 185, 129, 0.38)');
        incomeGradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        // Expense lush gradient
        const expenseGradient = ctx.createLinearGradient(0, 0, 0, 270);
        expenseGradient.addColorStop(0, 'rgba(244, 63, 94, 0.38)');
        expenseGradient.addColorStop(1, 'rgba(244, 63, 94, 0.0)');

        this.charts.monthlyExpense = new Chart(ctx, {
            type: 'line',
            data: {
                labels: monthlyData.labels,
                datasets: [
                    {
                        label: 'Pemasukan',
                        data: monthlyData.income,
                        borderColor: '#10b981',
                        backgroundColor: incomeGradient,
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#10b981',
                        pointBorderColor: isDark ? '#111827' : '#ffffff',
                        pointBorderWidth: 2.5,
                        pointRadius: 4.5,
                        pointHoverRadius: 7
                    },
                    {
                        label: 'Pengeluaran',
                        data: monthlyData.expenses,
                        borderColor: '#f43f5e',
                        backgroundColor: expenseGradient,
                        borderWidth: 3,
                        tension: 0.4,
                        fill: true,
                        pointBackgroundColor: '#f43f5e',
                        pointBorderColor: isDark ? '#111827' : '#ffffff',
                        pointBorderWidth: 2.5,
                        pointRadius: 4.5,
                        pointHoverRadius: 7
                    }
                ]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: {
                        position: 'top',
                        align: 'end',
                        labels: {
                            color: textColor,
                            usePointStyle: true,
                            boxWidth: 8,
                            padding: 15,
                            font: { family: 'Plus Jakarta Sans', size: 12, weight: '600' }
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1e293b' : '#0f172a',
                        titleColor: '#ffffff',
                        bodyColor: '#f1f5f9',
                        padding: 12,
                        cornerRadius: 10,
                        boxPadding: 6,
                        callbacks: {
                            label: (context) => ` ${context.dataset.label}: Rp ${(context.parsed.y || 0).toLocaleString('id-ID')}`
                        }
                    }
                },
                scales: {
                    y: {
                        beginAtZero: true,
                        ticks: {
                            color: textColor,
                            font: { family: 'Plus Jakarta Sans', size: 11 },
                            callback: (value) => {
                                if (value >= 1000000) return (value / 1000000).toFixed(1) + ' jt';
                                if (value >= 1000) return (value / 1000).toFixed(0) + ' rb';
                                return value;
                            }
                        },
                        grid: { color: gridColor, drawBorder: false }
                    },
                    x: {
                        ticks: {
                            color: textColor,
                            font: { family: 'Plus Jakarta Sans', size: 11 }
                        },
                        grid: { display: false }
                    }
                }
            }
        });
    }

    loadCategoryChart() {
        const canvas = document.getElementById('categoryChart');
        if (!canvas) return;

        const categoryData = storage.getCategoryExpenseData();
        if (this.charts.category) {
            this.charts.category.destroy();
        }

        const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
        const textColor = isDark ? '#94a3b8' : '#64748b';

        const ctx = canvas.getContext('2d');

        if (!categoryData.amounts.length || categoryData.amounts.every(a => a === 0)) {
            // Render placeholder empty doughnut
            this.charts.category = new Chart(ctx, {
                type: 'doughnut',
                data: {
                    labels: ['Belum ada pengeluaran'],
                    datasets: [{
                        data: [1],
                        backgroundColor: [isDark ? '#1a2234' : '#e2e8f0'],
                        borderWidth: 0
                    }]
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    cutout: '72%',
                    plugins: {
                        legend: { display: false },
                        tooltip: { enabled: false }
                    }
                }
            });
            return;
        }

        const totalExpense = categoryData.amounts.reduce((a, b) => a + b, 0);

        this.charts.category = new Chart(ctx, {
            type: 'doughnut',
            data: {
                labels: categoryData.labels,
                datasets: [{
                    data: categoryData.amounts,
                    backgroundColor: categoryData.colors,
                    borderColor: isDark ? '#111827' : '#ffffff',
                    borderWidth: 3,
                    hoverOffset: 6
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                cutout: '72%',
                plugins: {
                    legend: {
                        position: 'bottom',
                        labels: {
                            color: textColor,
                            usePointStyle: true,
                            boxWidth: 8,
                            padding: 12,
                            font: { family: 'Plus Jakarta Sans', size: 11, weight: '500' }
                        }
                    },
                    tooltip: {
                        backgroundColor: isDark ? '#1e293b' : '#0f172a',
                        titleColor: '#ffffff',
                        bodyColor: '#f1f5f9',
                        padding: 12,
                        cornerRadius: 10,
                        callbacks: {
                            label: (context) => {
                                const val = context.parsed || 0;
                                const pct = totalExpense > 0 ? Math.round((val / totalExpense) * 100) : 0;
                                return ` ${context.label}: Rp ${val.toLocaleString('id-ID')} (${pct}%)`;
                            }
                        }
                    }
                }
            }
        });
    }

    // ==========================================================================
    // Recent Transactions
    // ==========================================================================
    loadRecentTransactions() {
        const transactions = storage.getAllTransactions().slice(0, 10);
        const list = document.getElementById('recentTransactionsList');
        if (!list) return;
        
        if (transactions.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">📭</div>
                    <p>Belum ada riwayat transaksi</p>
                    <button type="button" class="btn btn-primary btn-sm" style="margin-top: 1rem;" onclick="window.app.openTransactionModal()">
                        + Catat Transaksi Pertama
                    </button>
                </div>
            `;
            return;
        }

        list.innerHTML = transactions.map(t => this.renderTransactionItem(t)).join('');
        this.bindTransactionListEvents(list, () => this.loadDashboard());
    }

    // ==========================================================================
    // Transactions Page (Search, Filter, Sort)
    // ==========================================================================
    loadTransactions() {
        const transactions = this.getFilteredTransactions();
        const list = document.getElementById('allTransactionsList');
        if (!list) return;

        // Update Summary Banner
        const income = transactions.filter(t => t.type === 'income').reduce((s, t) => s + t.amount, 0);
        const expense = transactions.filter(t => t.type === 'expense').reduce((s, t) => s + t.amount, 0);

        document.getElementById('summaryCount').textContent = `${transactions.length} Transaksi`;
        document.getElementById('summaryIncome').textContent = this.isBalanceHidden ? '••••••' : this.formatCurrency(income);
        document.getElementById('summaryExpense').textContent = this.isBalanceHidden ? '••••••' : this.formatCurrency(expense);

        if (transactions.length === 0) {
            list.innerHTML = `
                <div class="empty-state">
                    <div class="empty-state-icon">🔍</div>
                    <p>Tidak ada transaksi yang cocok dengan filter</p>
                </div>
            `;
            return;
        }

        list.innerHTML = transactions.map(t => this.renderTransactionItem(t)).join('');
        this.bindTransactionListEvents(list, () => this.loadTransactions());

        this.updateCategoryFilterDropdown();
    }

    getFilteredTransactions() {
        let transactions = storage.getAllTransactions();

        const searchQuery = (document.getElementById('searchTransactionInput')?.value || '').toLowerCase().trim();
        const filterType = document.getElementById('filterType')?.value || 'all';
        const filterCategory = document.getElementById('filterCategory')?.value || 'all';
        const sortOption = document.getElementById('sortTransactions')?.value || 'date-desc';

        // Filter by Search
        if (searchQuery) {
            transactions = transactions.filter(t => {
                const category = storage.getCategoryById(t.category);
                const noteMatch = (t.note || '').toLowerCase().includes(searchQuery);
                const catMatch = (category?.name || '').toLowerCase().includes(searchQuery);
                const amountMatch = t.amount.toString().includes(searchQuery);
                return noteMatch || catMatch || amountMatch;
            });
        }

        // Filter by Type
        if (filterType !== 'all') {
            transactions = transactions.filter(t => t.type === filterType);
        }

        // Filter by Category
        if (filterCategory !== 'all') {
            transactions = transactions.filter(t => t.category === filterCategory);
        }

        // Sorting
        transactions.sort((a, b) => {
            if (sortOption === 'date-desc') {
                return (b.timestamp || new Date(b.date).getTime()) - (a.timestamp || new Date(a.date).getTime());
            } else if (sortOption === 'date-asc') {
                return (a.timestamp || new Date(a.date).getTime()) - (b.timestamp || new Date(b.date).getTime());
            } else if (sortOption === 'amount-desc') {
                return b.amount - a.amount;
            } else if (sortOption === 'amount-asc') {
                return a.amount - b.amount;
            }
            return 0;
        });

        return transactions;
    }

    updateCategoryFilterDropdown() {
        const filterCategory = document.getElementById('filterCategory');
        if (!filterCategory) return;

        const currentValue = filterCategory.value;
        const categories = storage.getCategories();
        
        filterCategory.innerHTML = '<option value="all">Semua Kategori</option>';
        categories.forEach(cat => {
            const option = document.createElement('option');
            option.value = cat.id;
            option.textContent = `${cat.icon} ${cat.name}`;
            filterCategory.appendChild(option);
        });
        
        filterCategory.value = currentValue;
    }

    renderTransactionItem(transaction) {
        const category = storage.getCategoryById(transaction.category);
        const isIncome = transaction.type === 'income';
        const typeClass = isIncome ? 'income' : 'expense';
        const sign = isIncome ? '+' : '-';
        
        const displayAmount = this.isBalanceHidden 
            ? '••••••' 
            : `${sign} ${this.formatCurrency(transaction.amount)}`;

        return `
            <div class="transaction-item" data-id="${transaction.id}">
                <div class="transaction-info">
                    <div class="transaction-icon" style="--cat-color: ${category?.color || '#10b981'}">
                        ${category?.icon || '💰'}
                    </div>
                    <div class="transaction-details">
                        <h4>${category?.name || 'Tanpa Kategori'}</h4>
                        <div class="transaction-meta">
                            <span class="transaction-date-badge">${this.formatDate(transaction.date)}</span>
                            ${transaction.note ? `<span class="transaction-note-text">• ${this.escapeHtml(transaction.note)}</span>` : ''}
                        </div>
                    </div>
                </div>
                <div class="transaction-right">
                    <div class="transaction-amount ${typeClass}">
                        ${displayAmount}
                    </div>
                    <div class="transaction-actions">
                        <button class="btn-icon edit-btn" title="Edit Transaksi">✏️</button>
                        <button class="btn-icon delete-btn" title="Hapus Transaksi">🗑️</button>
                    </div>
                </div>
            </div>
        `;
    }

    bindTransactionListEvents(container, refreshCallback) {
        container.querySelectorAll('.transaction-item').forEach(item => {
            const id = item.dataset.id;
            
            item.querySelector('.edit-btn')?.addEventListener('click', (e) => {
                e.stopPropagation();
                const transaction = storage.getTransactionById(id);
                if (transaction) this.openTransactionModal(transaction);
            });
            
            item.querySelector('.delete-btn')?.addEventListener('click', async (e) => {
                e.stopPropagation();
                const confirmed = await this.showConfirm(
                    'Hapus Transaksi?',
                    'Catatan transaksi ini akan dihapus dari riwayat keuangan.',
                    'Hapus',
                    true,
                    '🗑️'
                );
                if (confirmed) {
                    storage.deleteTransaction(id);
                    this.showToast('Transaksi berhasil dihapus!', 'success');
                    refreshCallback();
                    this.checkDailyBudget();
                }
            });
        });
    }

    // ==========================================================================
    // Categories Page
    // ==========================================================================
    initCategoryTabs() {
        const tabExpense = document.getElementById('tabExpenseCategories');
        const tabIncome = document.getElementById('tabIncomeCategories');
        const sectionExpense = document.getElementById('expenseCategoriesSection');
        const sectionIncome = document.getElementById('incomeCategoriesSection');

        tabExpense?.addEventListener('click', () => {
            tabExpense.classList.add('active');
            tabIncome.classList.remove('active');
            sectionExpense.classList.add('active');
            sectionIncome.classList.remove('active');
        });

        tabIncome?.addEventListener('click', () => {
            tabIncome.classList.add('active');
            tabExpense.classList.remove('active');
            sectionIncome.classList.add('active');
            sectionExpense.classList.remove('active');
        });
    }

    loadCategories() {
        const categories = storage.getCategories();
        const allTransactions = storage.getAllTransactions();

        const incomeCategories = categories.filter(c => c.type === 'income');
        const expenseCategories = categories.filter(c => c.type === 'expense');

        document.getElementById('expenseCatCount').textContent = expenseCategories.length;
        document.getElementById('incomeCatCount').textContent = incomeCategories.length;

        this.renderCategoryCardsGrid('expenseCategoriesList', expenseCategories, allTransactions);
        this.renderCategoryCardsGrid('incomeCategoriesList', incomeCategories, allTransactions);
    }

    renderCategoryCardsGrid(containerId, categories, transactions) {
        const container = document.getElementById(containerId);
        if (!container) return;

        if (categories.length === 0) {
            container.innerHTML = `
                <div class="empty-state" style="grid-column: 1 / -1;">
                    <div class="empty-state-icon">📂</div>
                    <p>Belum ada kategori di bagian ini</p>
                </div>
            `;
            return;
        }

        container.innerHTML = categories.map(cat => {
            const usageCount = transactions.filter(t => t.category === cat.id).length;
            const totalSum = transactions
                .filter(t => t.category === cat.id)
                .reduce((sum, t) => sum + t.amount, 0);

            return `
                <div class="category-item" data-id="${cat.id}">
                    <div class="category-info">
                        <div class="category-icon-box" style="--cat-color: ${cat.color}">
                            ${cat.icon}
                        </div>
                        <div class="category-name-wrap">
                            <span class="category-name">${this.escapeHtml(cat.name)}</span>
                            <span class="category-usage">${usageCount} transaksi • ${this.isBalanceHidden ? '••••••' : this.formatCurrency(totalSum)}</span>
                        </div>
                    </div>
                    <div class="category-actions">
                        <button class="btn-icon edit-cat-btn" title="Edit Kategori">✏️</button>
                        <button class="btn-icon delete-cat-btn" title="Hapus Kategori">🗑️</button>
                    </div>
                </div>
            `;
        }).join('');

        // Bind Edit and Delete
        container.querySelectorAll('.category-item').forEach(item => {
            const id = item.dataset.id;
            
            item.querySelector('.edit-cat-btn')?.addEventListener('click', () => {
                const cat = storage.getCategoryById(id);
                if (cat) this.openCategoryModal(cat);
            });
            
            item.querySelector('.delete-cat-btn')?.addEventListener('click', async () => {
                const confirmed = await this.showConfirm(
                    'Hapus Kategori?',
                    'Kategori ini akan dihapus. Transaksi yang sudah terdaftar dengan kategori ini tidak akan hilang.',
                    'Hapus Kategori',
                    true,
                    '🏷️'
                );
                if (confirmed) {
                    storage.deleteCategory(id);
                    this.loadCategories();
                    this.showToast('Kategori berhasil dihapus!', 'success');
                }
            });
        });
    }

    // ==========================================================================
    // Reports Page
    // ==========================================================================
    initReportsPresets() {
        document.querySelectorAll('.quick-date-presets .preset-btn').forEach(btn => {
            btn.addEventListener('click', () => {
                const range = btn.dataset.range;
                this.setReportDateRange(range);
            });
        });
    }

    setReportDateRange(range) {
        const today = new Date();
        let startDate, endDate;

        if (range === 'this-month') {
            startDate = new Date(today.getFullYear(), today.getMonth(), 1);
            endDate = today;
        } else if (range === 'last-month') {
            startDate = new Date(today.getFullYear(), today.getMonth() - 1, 1);
            endDate = new Date(today.getFullYear(), today.getMonth(), 0);
        } else if (range === 'last-3-months') {
            startDate = new Date(today.getFullYear(), today.getMonth() - 3, 1);
            endDate = today;
        } else if (range === 'this-year') {
            startDate = new Date(today.getFullYear(), 0, 1);
            endDate = today;
        }

        if (startDate && endDate) {
            document.getElementById('reportStartDate').value = startDate.toISOString().split('T')[0];
            document.getElementById('reportEndDate').value = endDate.toISOString().split('T')[0];
            this.generateReport();
        }
    }

    loadReports() {
        const today = new Date();
        const firstDay = new Date(today.getFullYear(), today.getMonth(), 1);
        
        document.getElementById('reportStartDate').value = firstDay.toISOString().split('T')[0];
        document.getElementById('reportEndDate').value = today.toISOString().split('T')[0];
        this.generateReport();
    }

    generateReport() {
        const startDate = document.getElementById('reportStartDate').value;
        const endDate = document.getElementById('reportEndDate').value;
        
        if (!startDate || !endDate) {
            this.showToast('Pilih rentang tanggal terlebih dahulu!', 'warning');
            return;
        }

        const transactions = storage.getTransactionsByDateRange(startDate, endDate);
        
        const income = transactions
            .filter(t => t.type === 'income')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const expense = transactions
            .filter(t => t.type === 'expense')
            .reduce((sum, t) => sum + t.amount, 0);
        
        const balance = income - expense;
        const savingsRate = income > 0 ? Math.round(((income - expense) / income) * 100) : 0;

        // Calculate days in range
        const start = new Date(startDate);
        const end = new Date(endDate);
        const diffDays = Math.max(1, Math.ceil(Math.abs(end - start) / (1000 * 60 * 60 * 24)) + 1);
        const dailyAvg = Math.round(expense / diffDays);

        // Expense by category breakdown
        const categoryMap = {};
        transactions.filter(t => t.type === 'expense').forEach(t => {
            categoryMap[t.category] = (categoryMap[t.category] || 0) + t.amount;
        });

        const categoryBreakdown = Object.entries(categoryMap).map(([catId, amount]) => {
            const cat = storage.getCategoryById(catId);
            return {
                id: catId,
                name: cat?.name || 'Lainnya',
                icon: cat?.icon || '📦',
                color: cat?.color || '#10b981',
                amount: amount,
                percentage: expense > 0 ? Math.round((amount / expense) * 100) : 0
            };
        }).sort((a, b) => b.amount - a.amount);

        const reportContent = document.getElementById('reportContent');
        reportContent.innerHTML = `
            <div class="report-header-banner">
                <div>
                    <h3>Laporan Periode Keuangan</h3>
                    <p class="page-subtitle">${this.formatDate(startDate)} — ${this.formatDate(endDate)} (${diffDays} hari)</p>
                </div>
            </div>
            
            <!-- KPI Summary Cards -->
            <div class="report-kpi-grid">
                <div class="report-kpi-card">
                    <div class="kpi-label">Total Pemasukan</div>
                    <div class="kpi-value text-income">${this.isBalanceHidden ? '••••••' : this.formatCurrency(income)}</div>
                </div>
                <div class="report-kpi-card">
                    <div class="kpi-label">Total Pengeluaran</div>
                    <div class="kpi-value text-expense">${this.isBalanceHidden ? '••••••' : this.formatCurrency(expense)}</div>
                </div>
                <div class="report-kpi-card">
                    <div class="kpi-label">Saldo Bersih</div>
                    <div class="kpi-value ${balance >= 0 ? 'text-income' : 'text-expense'}">
                        ${this.isBalanceHidden ? '••••••' : this.formatCurrency(balance)}
                    </div>
                </div>
                <div class="report-kpi-card">
                    <div class="kpi-label">Tingkat Tabungan</div>
                    <div class="kpi-value" style="color: var(--color-info);">
                        ${savingsRate}%
                    </div>
                </div>
                <div class="report-kpi-card">
                    <div class="kpi-label">Rata-rata Harian</div>
                    <div class="kpi-value text-expense">
                        ${this.isBalanceHidden ? '••••••' : this.formatCurrency(dailyAvg) + '/hari'}
                    </div>
                </div>
            </div>

            <!-- Category Breakdown Progress Bars -->
            ${categoryBreakdown.length > 0 ? `
                <div class="report-breakdown-section">
                    <h4>Breakdown Pos Pengeluaran</h4>
                    <div class="category-progress-list">
                        ${categoryBreakdown.map(item => `
                            <div class="cat-progress-item">
                                <div class="cat-progress-labels">
                                    <span>${item.icon} ${item.name}</span>
                                    <span>${this.isBalanceHidden ? '••••••' : this.formatCurrency(item.amount)} (${item.percentage}%)</span>
                                </div>
                                <div class="cat-progress-bar">
                                    <div class="cat-progress-fill" style="width: ${item.percentage}%; --cat-color: ${item.color};"></div>
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            ` : ''}

            <!-- Transaction Detail Table / List -->
            <h4 style="margin-top: 1.5rem; margin-bottom: 0.75rem; font-size: 1.05rem; font-weight: 700;">
                Rincian Transaksi (${transactions.length})
            </h4>
            <div class="transaction-list">
                ${transactions.length > 0 ? 
                    transactions.map(t => this.renderTransactionItem(t)).join('') :
                    '<div class="empty-state"><p>Tidak ada transaksi pada rentang tanggal ini</p></div>'
                }
            </div>
        `;

        this.bindTransactionListEvents(reportContent, () => this.generateReport());
    }

    // ==========================================================================
    // Settings Page
    // ==========================================================================
    loadSettings() {
        const budget = storage.getDailyBudget();
        document.getElementById('dailyBudget').value = budget || '';
        
        const cloudEmail = storage.getCloudEmail();
        document.getElementById('cloudEmail').value = cloudEmail || '';
        
        this.updateCloudStatus();
        this.updatePrivacyUI();
        this.updateThemeUI();
    }

    saveDailyBudget() {
        const budget = parseFloat(document.getElementById('dailyBudget').value) || 0;
        storage.setDailyBudget(budget);
        this.showToast('Limit anggaran harian berhasil disimpan!', 'success');
        this.checkDailyBudget();
    }

    updateCloudStatus() {
        const status = document.getElementById('cloudStatus');
        const indicator = document.getElementById('cloudStatusIndicator');
        const isConnected = storage.getCloudEmail();
        const lastSync = storage.getLastSyncTime();
        
        if (isConnected) {
            status.textContent = `Tersambung sebagai ${isConnected}${lastSync ? ' • Sync: ' + this.formatDateTime(lastSync) : ''}`;
            status.style.color = 'var(--color-primary)';
            indicator?.classList.add('connected');
        } else {
            status.textContent = 'Status: Belum Tersambung';
            status.style.color = 'var(--text-muted)';
            indicator?.classList.remove('connected');
        }
    }

    // ==========================================================================
    // Utilities & Formatters
    // ==========================================================================
    formatCurrency(amount) {
        const val = Math.abs(amount) || 0;
        const formatted = 'Rp ' + val.toLocaleString('id-ID', {
            minimumFractionDigits: 0,
            maximumFractionDigits: 0
        });
        return amount < 0 ? `-${formatted}` : formatted;
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric'
        });
    }

    formatDateTime(timestamp) {
        if (!timestamp) return '-';
        const date = new Date(timestamp);
        return date.toLocaleDateString('id-ID', {
            day: 'numeric',
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    }

    escapeHtml(str) {
        if (!str) return '';
        return str
            .replace(/&/g, "&amp;")
            .replace(/</g, "&lt;")
            .replace(/>/g, "&gt;")
            .replace(/"/g, "&quot;")
            .replace(/'/g, "&#039;");
    }

    showToast(message, type = 'success') {
        const toast = document.getElementById('toast');
        if (!toast) return;

        const iconSpan = toast.querySelector('.toast-icon');
        const textSpan = toast.querySelector('.toast-text');

        let icon = '✅';
        if (type === 'error') icon = '❌';
        else if (type === 'warning') icon = '⚠️';

        if (iconSpan) iconSpan.textContent = icon;
        if (textSpan) textSpan.textContent = message;
        else toast.textContent = message;

        toast.className = `toast ${type} show`;
        
        clearTimeout(this.toastTimeout);
        this.toastTimeout = setTimeout(() => {
            toast.classList.remove('show');
        }, 3200);
    }
}

// Initialize Application when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.app = new FinanceApp();
});
