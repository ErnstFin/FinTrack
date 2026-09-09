<!DOCTYPE html>
<html lang="id">

<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description"
        content="FinTrack - Aplikasi Pencatat & Pengelola Keuangan Pribadi Modern, Cerdas, dan Lengkap">
    <meta name="theme-color" content="#10b981">
    <title>FinTrack PRO - Aplikasi Pengelola Keuangan Pribadi</title>

    <!-- Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap"
        rel="stylesheet">

    <!-- PWA Manifest -->
    <link rel="manifest" href="{{ asset('manifest.json') }}">

    <!-- Icons -->
    <link rel="apple-touch-icon" href="{{ asset('icons/icon-192.png') }}">
    <link rel="icon" type="image/png" href="{{ asset('icons/icon-192.png') }}">

    <!-- Styles -->
    <link rel="stylesheet" href="{{ asset('css/styles.css') }}">

    <!-- Chart.js for interactive analytics -->
    <script src="https://cdn.jsdelivr.net/npm/chart.js@4.4.0/dist/chart.umd.js"></script>

    <!-- jsPDF for PDF export -->
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.5.1/jspdf.umd.min.js"></script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/jspdf-autotable/3.8.2/jspdf.plugin.autotable.min.js"></script>

    <!-- SheetJS for Excel export -->
    <script src="https://cdn.sheetjs.com/xlsx-0.20.1/package/dist/xlsx.full.min.js"></script>
</head>

<body>
    <!-- App Container -->
    <div id="appRoot" class="app-root">

        <!-- Header -->
        <header class="header">
            <div class="container header-content">
                <!-- Logo -->
                <a href="{{ route('app') }}" class="logo" id="logoBtn" title="Kembali ke Dashboard">
                    <div class="logo-mark">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12V7H5a2 2 0 0 1 0-4h14v4" />
                            <path d="M3 5v14a2 2 0 0 0 2 2h16v-5" />
                            <path d="M18 12a2 2 0 0 0 0 4h4v-4Z" />
                        </svg>
                    </div>
                    <div class="logo-text-wrapper">
                        <span class="logo-text">Fin<span class="highlight">Track</span></span>
                        <span class="logo-badge">PRO</span>
                    </div>
                </a>

                <!-- Desktop Navigation Menu -->
                <nav class="nav-menu" aria-label="Navigasi Utama">
                    <button class="nav-btn active" data-page="dashboard">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <rect width="7" height="9" x="3" y="3" rx="1" />
                            <rect width="7" height="5" x="14" y="3" rx="1" />
                            <rect width="7" height="9" x="14" y="12" rx="1" />
                            <rect width="7" height="5" x="3" y="16" rx="1" />
                        </svg>
                        <span>Dashboard</span>
                    </button>
                    <button class="nav-btn" data-page="transactions">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <rect width="20" height="14" x="2" y="5" rx="2" />
                            <line x1="2" x2="22" y1="10" y2="10" />
                        </svg>
                        <span>Transaksi</span>
                    </button>
                    <button class="nav-btn" data-page="categories">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M12 2H2v10l9.29 9.29c.94.94 2.48.94 3.42 0l6.58-6.58c.94-.94.94-2.48 0-3.42L12 2Z" />
                            <path d="M7 7h.01" />
                        </svg>
                        <span>Kategori</span>
                    </button>
                    <button class="nav-btn" data-page="reports">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <line x1="18" x2="18" y1="20" y2="10" />
                            <line x1="12" x2="12" y1="20" y2="4" />
                            <line x1="6" x2="6" y1="20" y2="14" />
                        </svg>
                        <span>Laporan</span>
                    </button>
                    <button class="nav-btn" data-page="settings">
                        <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path
                                d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z" />
                            <circle cx="12" cy="12" r="3" />
                        </svg>
                        <span>Pengaturan</span>
                    </button>
                </nav>

                <!-- Header Actions -->
                <div class="header-actions">
                    <a href="{{ route('home') }}" class="icon-btn" title="Kembali ke Landing Page" aria-label="Landing Page">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="m3 9 9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                            <polyline points="9 22 9 12 15 12 15 22" />
                        </svg>
                    </a>
                    <button id="quickDemoBtn" class="btn btn-ghost btn-sm demo-badge-btn" title="Muat Data Sampel">
                        <span class="badge-icon">⚡</span>
                        <span class="btn-text">Demo</span>
                    </button>
                    <button id="syncBtn" class="icon-btn" title="Sinkronisasi Cloud">
                        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                            stroke-linecap="round" stroke-linejoin="round">
                            <path d="M17.5 19H9a7 7 0 1 1 6.71-9h1.79a4.5 4.5 0 1 1 0 9Z" />
                        </svg>
                        <span class="sync-dot"></span>
                    </button>
                    <button id="themeToggle" class="icon-btn" title="Ganti Mode Gelap / Terang">
                        <span class="theme-icon">🌙</span>
                    </button>
                </div>
            </div>
        </header>

        <!-- Main Content -->
        <main class="main-content">
            <div class="container">

                <!-- ========================================
                     DASHBOARD PAGE
                     ======================================== -->
                <section id="dashboard-page" class="page active">
                    <!-- Page Greeting & Action -->
                    <div class="page-header">
                        <div class="page-title-group">
                            <h2>Dashboard Finansial</h2>
                            <p class="page-subtitle" id="dashboardDateGreeting">Ringkasan arus kas dan pengeluaran Anda</p>
                        </div>
                        <div class="page-header-actions">
                            <button id="addTransactionBtn" class="btn btn-primary btn-glow">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Tambah Transaksi</span>
                            </button>
                        </div>
                    </div>

                    <!-- Balance Hero Cards -->
                    <div class="balance-cards">
                        <!-- Total Balance Card -->
                        <div class="balance-card balance-total">
                            <div class="balance-card-top">
                                <div class="balance-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <rect width="20" height="14" x="2" y="5" rx="2" />
                                        <line x1="2" x2="22" y1="10" y2="10" />
                                    </svg>
                                </div>
                                <button id="toggleBalancePrivacy" class="privacy-btn"
                                    title="Sembunyikan / Tampilkan Nominal">
                                    <svg id="eyeIcon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                        stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z" />
                                        <circle cx="12" cy="12" r="3" />
                                    </svg>
                                </button>
                            </div>
                            <div class="balance-card-body">
                                <div class="balance-label">Saldo Bersih</div>
                                <div class="balance-amount" id="totalBalance">Rp 0</div>
                            </div>
                            <div class="balance-card-footer">
                                <span class="cashflow-pill" id="cashflowStatusBadge">
                                    <span class="cashflow-dot"></span>
                                    <span id="cashflowStatusText">Arus Kas Stabil</span>
                                </span>
                            </div>
                        </div>

                        <!-- Total Income Card -->
                        <div class="balance-card balance-income">
                            <div class="balance-card-top">
                                <div class="balance-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m19 12-7-7-7 7" />
                                        <path d="M12 19V5" />
                                    </svg>
                                </div>
                                <span class="trend-badge trend-up">Pemasukan</span>
                            </div>
                            <div class="balance-card-body">
                                <div class="balance-label">Total Pemasukan</div>
                                <div class="balance-amount text-income" id="totalIncome">Rp 0</div>
                            </div>
                            <div class="balance-card-footer">
                                <span class="card-meta-text" id="incomeCountMeta">0 transaksi</span>
                            </div>
                        </div>

                        <!-- Total Expense Card -->
                        <div class="balance-card balance-expense">
                            <div class="balance-card-top">
                                <div class="balance-card-icon">
                                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                        stroke-linecap="round" stroke-linejoin="round">
                                        <path d="m19 12-7 7-7-7" />
                                        <path d="M12 5v14" />
                                    </svg>
                                </div>
                                <span class="trend-badge trend-down">Pengeluaran</span>
                            </div>
                            <div class="balance-card-body">
                                <div class="balance-label">Total Pengeluaran</div>
                                <div class="balance-amount text-expense" id="totalExpense">Rp 0</div>
                            </div>
                            <div class="balance-card-footer">
                                <span class="card-meta-text" id="expenseCountMeta">0 transaksi</span>
                            </div>
                        </div>
                    </div>

                    <!-- Financial Insights Quick Strip -->
                    <div class="insights-strip" id="insightsStrip">
                        <div class="insight-chip">
                            <div class="insight-chip-icon"
                                style="color: var(--color-info); background: var(--color-info-soft);">📊</div>
                            <div class="insight-chip-content">
                                <span class="insight-chip-label">Rata-rata Pengeluaran</span>
                                <span class="insight-chip-value" id="insightDailyAvg">Rp 0/hari</span>
                            </div>
                        </div>
                        <div class="insight-chip">
                            <div class="insight-chip-icon"
                                style="color: var(--color-income); background: var(--color-income-soft);">🌱</div>
                            <div class="insight-chip-content">
                                <span class="insight-chip-label">Tingkat Tabungan</span>
                                <span class="insight-chip-value" id="insightSavingsRate">0%</span>
                            </div>
                        </div>
                        <div class="insight-chip">
                            <div class="insight-chip-icon"
                                style="color: var(--color-warning); background: var(--color-warning-soft);">🏷️</div>
                            <div class="insight-chip-content">
                                <span class="insight-chip-label">Pos Terbesar</span>
                                <span class="insight-chip-value" id="insightTopCat">-</span>
                            </div>
                        </div>
                    </div>

                    <!-- Daily & Monthly Budget Progress Card -->
                    <div class="budget-tracker-card" id="budgetTrackerCard">
                        <div class="budget-tracker-header">
                            <div class="budget-info">
                                <div class="budget-title-wrap">
                                    <span class="budget-icon">🎯</span>
                                    <h4>Monitoring Anggaran Harian</h4>
                                </div>
                                <p class="budget-sub" id="budgetSubText">Pantau batas belanja hari ini agar keuangan tetap aman</p>
                            </div>
                            <div class="budget-status-pill" id="budgetStatusPill">
                                <span id="budgetStatusLabel">Belum Diatur</span>
                            </div>
                        </div>

                        <div class="budget-progress-container">
                            <div class="budget-progress-bar">
                                <div class="budget-progress-fill" id="budgetProgressFill" style="width: 0%;"></div>
                            </div>
                        </div>

                        <div class="budget-metrics-grid">
                            <div class="budget-metric">
                                <span class="metric-label">Pengeluaran Hari Ini</span>
                                <span class="metric-value text-expense" id="todaySpentValue">Rp 0</span>
                            </div>
                            <div class="budget-metric">
                                <span class="metric-label">Batas Limit Harian</span>
                                <span class="metric-value" id="dailyBudgetValue">Belum diatur</span>
                            </div>
                            <div class="budget-metric">
                                <span class="metric-label">Sisa Anggaran</span>
                                <span class="metric-value" id="remainingBudgetValue">Rp 0</span>
                            </div>
                        </div>

                        <div id="budgetAlert" class="alert alert-warning hidden">
                            <span class="alert-icon">⚠️</span>
                            <span class="alert-message"></span>
                        </div>
                    </div>

                    <!-- Period Filter Selector -->
                    <div class="period-filter-wrapper">
                        <span class="filter-label">Filter Analisis Waktu:</span>
                        <div class="segmented-control" id="periodSegmentedControl">
                            <button type="button" class="segment-btn" data-period="daily">Hari Ini</button>
                            <button type="button" class="segment-btn" data-period="weekly">Minggu Ini</button>
                            <button type="button" class="segment-btn active" data-period="monthly">Bulan Ini</button>
                            <button type="button" class="segment-btn" data-period="yearly">Tahun Ini</button>
                            <button type="button" class="segment-btn" data-period="all">Semua</button>
                        </div>
                        <select id="periodSelect" class="form-select hidden" aria-hidden="true">
                            <option value="daily">Hari Ini</option>
                            <option value="weekly">Minggu Ini</option>
                            <option value="monthly" selected>Bulan Ini</option>
                            <option value="yearly">Tahun Ini</option>
                            <option value="all">Semua</option>
                        </select>
                    </div>

                    <!-- Analytics Charts Grid -->
                    <div class="charts-grid">
                        <div class="chart-card">
                            <div class="chart-header">
                                <div class="chart-title-wrap">
                                    <h3>Tren Arus Kas Bulanan</h3>
                                    <span class="chart-sub">Perbandingan Pemasukan vs Pengeluaran</span>
                                </div>
                            </div>
                            <div class="chart-canvas-container">
                                <canvas id="monthlyExpenseChart"></canvas>
                            </div>
                        </div>

                        <div class="chart-card">
                            <div class="chart-header">
                                <div class="chart-title-wrap">
                                    <h3>Distribusi Kategori Pengeluaran</h3>
                                    <span class="chart-sub">Breakdown pengeluaran per pos kategori</span>
                                </div>
                            </div>
                            <div class="chart-canvas-container doughnut-container">
                                <canvas id="categoryChart"></canvas>
                            </div>
                        </div>
                    </div>

                    <!-- Recent Transactions Section -->
                    <div class="recent-transactions-section">
                        <div class="section-header">
                            <div class="section-title-wrap">
                                <h3>Transaksi Terbaru</h3>
                                <span class="section-sub">10 catatan transaksi terakhir Anda</span>
                            </div>
                            <button class="btn btn-ghost btn-sm" id="seeAllTransactionsBtn">
                                <span>Lihat Semua</span>
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                    <polyline points="12 5 19 12 12 19" />
                                </svg>
                            </button>
                        </div>
                        <div id="recentTransactionsList" class="transaction-list"></div>
                    </div>
                </section>

                <!-- ========================================
                     TRANSACTIONS PAGE
                     ======================================== -->
                <section id="transactions-page" class="page">
                    <div class="page-header">
                        <div class="page-title-group">
                            <h2>Semua Transaksi</h2>
                            <p class="page-subtitle">Kelola, cari, dan telusuri seluruh riwayat keuangan</p>
                        </div>
                        <div class="page-header-actions">
                            <button id="addTransactionBtn2" class="btn btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Tambah Transaksi</span>
                            </button>
                        </div>
                    </div>

                    <!-- Transaction Filter & Search Toolbar -->
                    <div class="transactions-toolbar">
                        <!-- Search Box -->
                        <div class="search-input-wrap">
                            <svg class="search-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor"
                                stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                                <circle cx="11" cy="11" r="8" />
                                <line x1="21" y1="21" x2="16.65" y2="16.65" />
                            </svg>
                            <input type="text" id="searchTransactionInput" class="form-input search-input"
                                placeholder="Cari catatan transaksi, kategori, atau nominal...">
                            <button type="button" id="clearSearchBtn" class="clear-search-btn hidden"
                                title="Hapus pencarian">&times;</button>
                        </div>

                        <!-- Filter Controls -->
                        <div class="filters-row">
                            <!-- Type Filters -->
                            <div class="type-filter-pills" id="typeFilterPills">
                                <button type="button" class="pill-btn active" data-type="all">Semua</button>
                                <button type="button" class="pill-btn" data-type="income">Pemasukan</button>
                                <button type="button" class="pill-btn" data-type="expense">Pengeluaran</button>
                            </div>
                            <select id="filterType" class="form-select hidden">
                                <option value="all">Semua Tipe</option>
                                <option value="income">Pemasukan</option>
                                <option value="expense">Pengeluaran</option>
                            </select>

                            <!-- Category Dropdown -->
                            <div class="filter-select-wrap">
                                <select id="filterCategory" class="form-select">
                                    <option value="all">Semua Kategori</option>
                                </select>
                            </div>

                            <!-- Sort Dropdown -->
                            <div class="filter-select-wrap">
                                <select id="sortTransactions" class="form-select">
                                    <option value="date-desc">Terbaru (Tanggal ↓)</option>
                                    <option value="date-asc">Terlama (Tanggal ↑)</option>
                                    <option value="amount-desc">Nominal Terbesar</option>
                                    <option value="amount-asc">Nominal Terkecil</option>
                                </select>
                            </div>
                        </div>
                    </div>

                    <!-- Filtered Summary Banner -->
                    <div id="transactionsSummaryBanner" class="transactions-summary-banner">
                        <div class="summary-stat">
                            <span class="stat-label">Ditemukan:</span>
                            <span class="stat-val" id="summaryCount">0 Transaksi</span>
                        </div>
                        <div class="summary-divider"></div>
                        <div class="summary-stat">
                            <span class="stat-label">Total Pemasukan:</span>
                            <span class="stat-val text-income" id="summaryIncome">Rp 0</span>
                        </div>
                        <div class="summary-divider"></div>
                        <div class="summary-stat">
                            <span class="stat-label">Total Pengeluaran:</span>
                            <span class="stat-val text-expense" id="summaryExpense">Rp 0</span>
                        </div>
                    </div>

                    <!-- All Transactions List -->
                    <div id="allTransactionsList" class="transaction-list card-container"></div>
                </section>

                <!-- ========================================
                     CATEGORIES PAGE
                     ======================================== -->
                <section id="categories-page" class="page">
                    <div class="page-header">
                        <div class="page-title-group">
                            <h2>Kelola Kategori</h2>
                            <p class="page-subtitle">Kustomisasi kategori pemasukan dan pengeluaran sesuai kebutuhan</p>
                        </div>
                        <div class="page-header-actions">
                            <button id="addCategoryBtn" class="btn btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <line x1="12" y1="5" x2="12" y2="19" />
                                    <line x1="5" y1="12" x2="19" y2="12" />
                                </svg>
                                <span>Tambah Kategori</span>
                            </button>
                        </div>
                    </div>

                    <!-- Category Tabs -->
                    <div class="category-tabs-bar">
                        <button class="cat-tab-btn active" id="tabExpenseCategories"
                            data-target="expenseCategoriesSection">
                            <span>💸 Pengeluaran</span>
                            <span class="cat-tab-count" id="expenseCatCount">0</span>
                        </button>
                        <button class="cat-tab-btn" id="tabIncomeCategories" data-target="incomeCategoriesSection">
                            <span>💰 Pemasukan</span>
                            <span class="cat-tab-count" id="incomeCatCount">0</span>
                        </button>
                    </div>

                    <div class="categories-grid-container">
                        <!-- Expense Section -->
                        <div id="expenseCategoriesSection" class="category-section active">
                            <div class="section-card-header">
                                <h3>Kategori Pengeluaran</h3>
                                <p>Kategori untuk memantau pos-pos belanja harian dan tagihan</p>
                            </div>
                            <div id="expenseCategoriesList" class="categories-cards-grid"></div>
                        </div>

                        <!-- Income Section -->
                        <div id="incomeCategoriesSection" class="category-section">
                            <div class="section-card-header">
                                <h3>Kategori Pemasukan</h3>
                                <p>Kategori untuk mencatat sumber penghasilan dan pendapatan</p>
                            </div>
                            <div id="incomeCategoriesList" class="categories-cards-grid"></div>
                        </div>
                    </div>
                </section>

                <!-- ========================================
                     REPORTS PAGE
                     ======================================== -->
                <section id="reports-page" class="page">
                    <div class="page-header">
                        <div class="page-title-group">
                            <h2>Laporan Keuangan</h2>
                            <p class="page-subtitle">Analisis menyeluruh, ekspor PDF profesional, dan spreadsheet Excel</p>
                        </div>
                        <div class="export-buttons">
                            <button id="exportPdfBtn" class="btn btn-secondary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
                                    <polyline points="14 2 14 8 20 8" />
                                    <line x1="16" y1="13" x2="8" y2="13" />
                                    <line x1="16" y1="17" x2="8" y2="17" />
                                    <polyline points="10 9 9 9 8 9" />
                                </svg>
                                <span>Export PDF</span>
                            </button>
                            <button id="exportExcelBtn" class="btn btn-secondary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <rect width="18" height="18" x="3" y="3" rx="2" />
                                    <line x1="3" y1="9" x2="21" y2="9" />
                                    <line x1="3" y1="15" x2="21" y2="15" />
                                    <line x1="9" y1="3" x2="9" y2="21" />
                                    <line x1="15" y1="3" x2="15" y2="21" />
                                </svg>
                                <span>Export Excel</span>
                            </button>
                        </div>
                    </div>

                    <!-- Date Range Filter Card -->
                    <div class="report-filters-card">
                        <div class="quick-date-presets">
                            <span class="preset-label">Rentang Cepat:</span>
                            <div class="preset-buttons">
                                <button type="button" class="preset-btn" data-range="this-month">Bulan Ini</button>
                                <button type="button" class="preset-btn" data-range="last-month">Bulan Lalu</button>
                                <button type="button" class="preset-btn" data-range="last-3-months">3 Bulan Terakhir</button>
                                <button type="button" class="preset-btn" data-range="this-year">Tahun Ini</button>
                            </div>
                        </div>

                        <div class="custom-date-inputs">
                            <div class="form-group">
                                <label for="reportStartDate">Dari Tanggal:</label>
                                <input type="date" id="reportStartDate" class="form-input">
                            </div>
                            <div class="form-group">
                                <label for="reportEndDate">Sampai Tanggal:</label>
                                <input type="date" id="reportEndDate" class="form-input">
                            </div>
                            <button id="generateReportBtn" class="btn btn-primary">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                                    stroke-linecap="round" stroke-linejoin="round">
                                    <polygon points="5 3 19 12 5 21 5 3" />
                                </svg>
                                <span>Tampilkan Laporan</span>
                            </button>
                        </div>
                    </div>

                    <!-- Report Content Output -->
                    <div id="reportContent" class="report-content"></div>
                </section>

                <!-- ========================================
                     SETTINGS PAGE
                     ======================================== -->
                <section id="settings-page" class="page">
                    <div class="page-header">
                        <div class="page-title-group">
                            <h2>Pengaturan</h2>
                            <p class="page-subtitle">Kelola preferensi akun, batas anggaran, dan pencadangan data</p>
                        </div>
                    </div>

                    <div class="settings-grid">
                        <!-- Budget Limit Settings -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <div class="settings-icon-box">
                                    <span>🎯</span>
                                </div>
                                <div>
                                    <h3>Target & Anggaran Harian</h3>
                                    <p>Atur batas maksimal pengeluaran harian Anda</p>
                                </div>
                            </div>
                            <div class="settings-card-body">
                                <div class="form-group">
                                    <label for="dailyBudget">Limit Pengeluaran Harian (Rp):</label>
                                    <div class="input-prefix-wrap">
                                        <span class="input-prefix">Rp</span>
                                        <input type="number" id="dailyBudget" class="form-input"
                                            placeholder="Contoh: 150000" min="0" step="any">
                                    </div>
                                    <span class="input-helper">Sistem akan memberi peringatan jika pengeluaran harian
                                        mencapai 80% dari limit ini.</span>
                                </div>
                                <button id="saveBudgetBtn" class="btn btn-primary">
                                    <span>Simpan Anggaran</span>
                                </button>
                            </div>
                        </div>

                        <!-- Cloud Sync Settings -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <div class="settings-icon-box">
                                    <span>☁️</span>
                                </div>
                                <div>
                                    <h3>Sinkronisasi Cloud</h3>
                                    <p>Cadangkan dan akses data Anda dari berbagai perangkat</p>
                                </div>
                            </div>
                            <div class="settings-card-body">
                                <div class="form-group">
                                    <label for="cloudEmail">Email Akun Cloud:</label>
                                    <input type="email" id="cloudEmail" class="form-input" placeholder="nama@email.com">
                                </div>
                                <div class="cloud-status-box">
                                    <div class="cloud-status-indicator" id="cloudStatusIndicator"></div>
                                    <span id="cloudStatus">Status: Belum Tersambung</span>
                                </div>
                                <div class="settings-btn-group">
                                    <button id="connectCloudBtn" class="btn btn-primary">Hubungkan Akun</button>
                                </div>
                            </div>
                        </div>

                        <!-- Appearance & Privacy Preferences -->
                        <div class="settings-card">
                            <div class="settings-card-header">
                                <div class="settings-icon-box">
                                    <span>🎨</span>
                                </div>
                                <div>
                                    <h3>Tampilan & Privasi</h3>
                                    <p>Sesuaikan tema antarmuka dan visibilitas nominal</p>
                                </div>
                            </div>
                            <div class="settings-card-body">
                                <div class="settings-row">
                                    <div>
                                        <div class="setting-item-title">Mode Gelap (Dark Theme)</div>
                                        <div class="setting-item-desc">Tampilan obsidian modern yang nyaman untuk mata</div>
                                    </div>
                                    <label class="switch" for="settingsThemeSwitch" title="Toggle Tema">
                                        <input type="checkbox" id="settingsThemeSwitch">
                                        <span class="slider"></span>
                                    </label>
                                </div>
                                <div class="settings-row">
                                    <div>
                                        <div class="setting-item-title">Mode Privasi Saldo</div>
                                        <div class="setting-item-desc">Sembunyikan nominal saldo saat membuka aplikasi di tempat umum</div>
                                    </div>
                                    <label class="switch" for="settingsPrivacySwitch" title="Toggle Mode Privasi">
                                        <input type="checkbox" id="settingsPrivacySwitch">
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>

                        <!-- Data Management Settings -->
                        <div class="settings-card danger-zone-card">
                            <div class="settings-card-header">
                                <div class="settings-icon-box">
                                    <span>💾</span>
                                </div>
                                <div>
                                    <h3>Pencadangan & Manajemen Data</h3>
                                    <p>Cadangkan, pulihkan, muat data demo, atau hapus seluruh data</p>
                                </div>
                            </div>
                            <div class="settings-card-body">
                                <div class="data-actions-grid">
                                    <button id="loadDemoDataBtn" class="btn btn-ghost border-btn">
                                        <span>⚡ Muat Data Demo (6 Bulan)</span>
                                    </button>
                                    <button id="openExportFinanceModalBtn" class="btn btn-primary">
                                        <span>📥 Export Data Keuangan</span>
                                    </button>
                                </div>
                                <div class="danger-section">
                                    <button id="clearDataBtn" class="btn btn-danger">
                                        <span>🗑️ Hapus Semua Data</span>
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
            </div>
        </main>

        <!-- Floating Action Button for Mobile -->
        <button id="mobileFab" class="mobile-fab" title="Tambah Transaksi Cepat" aria-label="Tambah Transaksi">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round"
                stroke-linejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
        </button>

        <!-- Bottom Navigation (Mobile) -->
        <nav class="bottom-nav" aria-label="Navigasi Bawah">
            <button class="nav-btn active" data-page="dashboard">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <rect width="7" height="9" x="3" y="3" rx="1" />
                    <rect width="7" height="5" x="14" y="3" rx="1" />
                    <rect width="7" height="9" x="14" y="12" rx="1" />
                    <rect width="7" height="5" x="3" y="16" rx="1" />
                </svg>
                <span>Beranda</span>
            </button>
            <button class="nav-btn" data-page="transactions">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <rect width="20" height="14" x="2" y="5" rx="2" />
                    <line x1="2" x2="22" y1="10" y2="10" />
                </svg>
                <span>Transaksi</span>
            </button>
            <div class="bottom-nav-spacer"></div>
            <button class="nav-btn" data-page="reports">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <line x1="18" x2="18" y1="20" y2="10" />
                    <line x1="12" x2="12" y1="20" y2="4" />
                    <line x1="6" x2="6" y1="20" y2="14" />
                </svg>
                <span>Laporan</span>
            </button>
            <button class="nav-btn" data-page="settings">
                <svg class="nav-icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"
                    stroke-linecap="round" stroke-linejoin="round">
                    <circle cx="12" cy="12" r="3" />
                    <path
                        d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z" />
                </svg>
                <span>Setelan</span>
            </button>
        </nav>

        <!-- ========================================
             MODALS
             ======================================== -->

        <!-- Transaction Modal -->
        <div id="transactionModal" class="modal" role="dialog" aria-modal="true"
            aria-labelledby="transactionModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="transactionModalTitle">Tambah Transaksi</h3>
                    <button class="modal-close" aria-label="Tutup">&times;</button>
                </div>
                <form id="transactionForm" class="modal-body">
                    <input type="hidden" id="transactionId">

                    <!-- Segmented Type Selector -->
                    <div class="form-group">
                        <label>Tipe Transaksi:</label>
                        <div class="type-segmented-select">
                            <button type="button" class="type-select-btn active expense-select" data-type="expense">
                                <span>💸 Pengeluaran</span>
                            </button>
                            <button type="button" class="type-select-btn income-select" data-type="income">
                                <span>💰 Pemasukan</span>
                            </button>
                        </div>
                        <select id="transactionType" class="form-input hidden" required>
                            <option value="expense" selected>Pengeluaran</option>
                            <option value="income">Pemasukan</option>
                        </select>
                    </div>

                    <!-- Nominal Amount with Live Format & Quick Presets -->
                    <div class="form-group">
                        <label for="transactionAmount">Nominal (Rp):</label>
                        <div class="amount-input-wrap">
                            <span class="amount-prefix">Rp</span>
                            <input type="number" id="transactionAmount" class="form-input amount-field tabular-nums"
                                min="1" step="any" placeholder="0" required>
                        </div>
                        <div class="amount-helper" id="amountSpelledHelper">Masukkan nominal transaksi</div>
                        <!-- Quick Add Buttons -->
                        <div class="quick-amounts">
                            <button type="button" class="quick-amount-btn" data-add="10000">+10rb</button>
                            <button type="button" class="quick-amount-btn" data-add="20000">+20rb</button>
                            <button type="button" class="quick-amount-btn" data-add="50000">+50rb</button>
                            <button type="button" class="quick-amount-btn" data-add="100000">+100rb</button>
                            <button type="button" class="quick-amount-btn" data-add="500000">+500rb</button>
                        </div>
                    </div>

                    <!-- Category Selector -->
                    <div class="form-group">
                        <label for="transactionCategory">Kategori:</label>
                        <select id="transactionCategory" class="form-input" required>
                            <option value="">Pilih Kategori</option>
                        </select>
                    </div>

                    <!-- Date with Today & Yesterday Shortcuts -->
                    <div class="form-group">
                        <div class="label-with-shortcuts">
                            <label for="transactionDate">Tanggal:</label>
                            <div class="date-shortcuts">
                                <button type="button" class="date-shortcut-btn" id="shortcutDateToday">Hari ini</button>
                                <button type="button" class="date-shortcut-btn"
                                    id="shortcutDateYesterday">Kemarin</button>
                            </div>
                        </div>
                        <input type="date" id="transactionDate" class="form-input" required>
                    </div>

                    <!-- Note -->
                    <div class="form-group">
                        <label for="transactionNote">Catatan / Deskripsi:</label>
                        <textarea id="transactionNote" class="form-input" rows="2"
                            placeholder="Contoh: Makan siang di resto, Gaji bulanan, Bensin mobil..."></textarea>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-cancel">Batal</button>
                        <button type="submit" class="btn btn-primary" id="saveTransactionSubmitBtn">Simpan Transaksi</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Category Modal -->
        <div id="categoryModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="categoryModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="categoryModalTitle">Tambah Kategori</h3>
                    <button class="modal-close" aria-label="Tutup">&times;</button>
                </div>
                <form id="categoryForm" class="modal-body">
                    <input type="hidden" id="categoryId">

                    <div class="form-group">
                        <label for="categoryType">Tipe Kategori:</label>
                        <select id="categoryType" class="form-input" required>
                            <option value="expense">Pengeluaran</option>
                            <option value="income">Pemasukan</option>
                        </select>
                    </div>

                    <div class="form-group">
                        <label for="categoryName">Nama Kategori:</label>
                        <input type="text" id="categoryName" class="form-input" placeholder="Contoh: Belanja Bulanan"
                            required>
                    </div>

                    <div class="form-group">
                        <label for="categoryIcon">Icon (Emoji):</label>
                        <div class="emoji-input-group">
                            <input type="text" id="categoryIcon" class="form-input emoji-field" maxlength="4"
                                placeholder="🍔">
                            <div class="emoji-presets">
                                <button type="button" class="emoji-btn">🍔</button>
                                <button type="button" class="emoji-btn">🚗</button>
                                <button type="button" class="emoji-btn">🛒</button>
                                <button type="button" class="emoji-btn">📱</button>
                                <button type="button" class="emoji-btn">🎬</button>
                                <button type="button" class="emoji-btn">🏥</button>
                                <button type="button" class="emoji-btn">💰</button>
                                <button type="button" class="emoji-btn">🎁</button>
                                <button type="button" class="emoji-btn">💼</button>
                                <button type="button" class="emoji-btn">📈</button>
                            </div>
                        </div>
                    </div>

                    <div class="form-group">
                        <label for="categoryColor">Warna Identitas:</label>
                        <div class="color-picker-group">
                            <input type="color" id="categoryColor" class="color-input-native" value="#10b981">
                            <div class="color-presets">
                                <button type="button" class="color-dot" data-color="#10b981"
                                    style="background: #10b981;"></button>
                                <button type="button" class="color-dot" data-color="#06b6d4"
                                    style="background: #06b6d4;"></button>
                                <button type="button" class="color-dot" data-color="#3b82f6"
                                    style="background: #3b82f6;"></button>
                                <button type="button" class="color-dot" data-color="#8b5cf6"
                                    style="background: #8b5cf6;"></button>
                                <button type="button" class="color-dot" data-color="#ec4899"
                                    style="background: #ec4899;"></button>
                                <button type="button" class="color-dot" data-color="#f43f5e"
                                    style="background: #f43f5e;"></button>
                                <button type="button" class="color-dot" data-color="#f59e0b"
                                    style="background: #f59e0b;"></button>
                                <button type="button" class="color-dot" data-color="#84cc16"
                                    style="background: #84cc16;"></button>
                            </div>
                        </div>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-cancel">Batal</button>
                        <button type="submit" class="btn btn-primary">Simpan Kategori</button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Export Finance Modal -->
        <div id="exportFinanceModal" class="modal" role="dialog" aria-modal="true" aria-labelledby="exportFinanceModalTitle">
            <div class="modal-content">
                <div class="modal-header">
                    <h3 id="exportFinanceModalTitle">📥 Export Data Keuangan</h3>
                    <button class="modal-close" aria-label="Tutup">&times;</button>
                </div>
                <form id="exportFinanceForm" class="modal-body">
                    <!-- Format Choice -->
                    <div class="form-group">
                        <label>Format File Export (Sesuai Pilihan Anda):</label>
                        <div class="type-segmented-select export-format-select">
                            <button type="button" class="type-select-btn format-select-btn active" data-format="pdf">
                                <span>📄 Dokumen PDF</span>
                            </button>
                            <button type="button" class="type-select-btn format-select-btn" data-format="xlsx">
                                <span>📊 Excel (.xlsx)</span>
                            </button>
                        </div>
                        <input type="hidden" id="exportSelectedFormat" value="pdf">
                    </div>

                    <!-- Scope / Period Choice -->
                    <div class="form-group">
                        <label for="exportSelectedPeriod">Rentang / Periode Data:</label>
                        <select id="exportSelectedPeriod" class="form-input">
                            <option value="all" selected>Semua Transaksi (All-Time)</option>
                            <option value="this-month">Bulan Ini</option>
                            <option value="this-year">Tahun Ini</option>
                            <option value="custom">Rentang Tanggal Kustom...</option>
                        </select>
                    </div>

                    <!-- Custom Date Range (hidden by default unless 'custom' is selected) -->
                    <div id="exportCustomDateRange" class="form-group hidden">
                        <div class="form-row-grid">
                            <div>
                                <label for="exportCustomStartDate">Dari Tanggal:</label>
                                <input type="date" id="exportCustomStartDate" class="form-input">
                            </div>
                            <div>
                                <label for="exportCustomEndDate">Sampai Tanggal:</label>
                                <input type="date" id="exportCustomEndDate" class="form-input">
                            </div>
                        </div>
                    </div>

                    <div class="export-modal-info-box">
                        <span class="info-icon">💡</span>
                        <span id="exportFormatDescription">Format <strong>PDF</strong> menghasilkan laporan formal siap cetak dengan ringkasan arus kas, tabel rincian transaksi, dan breakdown per kategori.</span>
                    </div>

                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary modal-cancel">Batal</button>
                        <button type="submit" class="btn btn-primary" id="downloadExportFileBtn">
                            <span>🚀 Unduh File Laporan</span>
                        </button>
                    </div>
                </form>
            </div>
        </div>

        <!-- Custom Confirmation Modal (Modern Dialog) -->
        <div id="confirmModal" class="modal" role="dialog" aria-modal="true">
            <div class="modal-content confirm-modal-content">
                <div class="confirm-icon-box" id="confirmIconBox">
                    <span id="confirmIcon">⚠️</span>
                </div>
                <h3 id="confirmTitle">Konfirmasi Tindakan</h3>
                <p id="confirmMessage">Apakah Anda yakin ingin melanjutkan tindakan ini?</p>
                <div class="confirm-modal-actions">
                    <button type="button" id="confirmCancelBtn" class="btn btn-secondary">Batal</button>
                    <button type="button" id="confirmOkBtn" class="btn btn-danger">Lanjutkan</button>
                </div>
            </div>
        </div>

        <!-- Toast Notification -->
        <div id="toast" class="toast" role="alert">
            <span class="toast-icon"></span>
            <span class="toast-text"></span>
        </div>

    </div>

    <!-- Scripts -->
    <script src="{{ asset('js/storage.js') }}"></script>
    <script src="{{ asset('js/cloud-sync.js') }}"></script>
    <script src="{{ asset('js/export.js') }}"></script>
    <script src="{{ asset('js/demo-data.js') }}"></script>
    <script src="{{ asset('js/app.js') }}"></script>
    <script src="{{ asset('js/pwa.js') }}"></script>
</body>

</html>
