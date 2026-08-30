/**
 * Ngaturuang (FinTrack) - Landing Page Interactive Scripts
 */

document.addEventListener('DOMContentLoaded', () => {
    initThemeToggle();
    initHeaderScroll();
    initMobileNav();
    initFaqAccordion();
    initFinancialSimulator();
    initNumberCounters();
});

/* --------------------------------------------------------------------------
   Theme Management (Persisted with App Theme)
   -------------------------------------------------------------------------- */
function initThemeToggle() {
    const themeBtn = document.getElementById('themeToggle');
    const themeIcon = document.getElementById('themeIcon');
    
    // Check saved theme or system preference
    const savedTheme = localStorage.getItem('fintrack_theme') || 'dark';
    document.documentElement.setAttribute('data-theme', savedTheme);
    updateThemeIcon(savedTheme);

    if (themeBtn) {
        themeBtn.addEventListener('click', () => {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('fintrack_theme', newTheme);
            updateThemeIcon(newTheme);
        });
    }

    function updateThemeIcon(theme) {
        if (!themeIcon) return;
        themeIcon.textContent = theme === 'dark' ? '🌙' : '☀️';
    }
}

/* --------------------------------------------------------------------------
   Header Scroll State
   -------------------------------------------------------------------------- */
function initHeaderScroll() {
    const header = document.querySelector('.landing-header');
    if (!header) return;

    window.addEventListener('scroll', () => {
        if (window.scrollY > 30) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });
}

/* --------------------------------------------------------------------------
   Mobile Navigation
   -------------------------------------------------------------------------- */
function initMobileNav() {
    const toggleBtn = document.getElementById('mobileToggle');
    const navLinks = document.getElementById('navLinks');

    if (toggleBtn && navLinks) {
        toggleBtn.addEventListener('click', () => {
            navLinks.classList.toggle('open');
            toggleBtn.textContent = navLinks.classList.contains('open') ? '✕' : '☰';
        });

        // Close on link click
        navLinks.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', () => {
                navLinks.classList.remove('open');
                toggleBtn.textContent = '☰';
            });
        });
    }
}

/* --------------------------------------------------------------------------
   FAQ Accordion
   -------------------------------------------------------------------------- */
function initFaqAccordion() {
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const questionBtn = item.querySelector('.faq-question');
        if (questionBtn) {
            questionBtn.addEventListener('click', () => {
                const isActive = item.classList.contains('active');
                
                // Close all other items
                faqItems.forEach(otherItem => otherItem.classList.remove('active'));

                // Toggle current
                if (!isActive) {
                    item.classList.add('active');
                }
            });
        }
    });
}

/* --------------------------------------------------------------------------
   Interactive Financial Health Simulator
   -------------------------------------------------------------------------- */
function initFinancialSimulator() {
    const incomeSlider = document.getElementById('incomeSlider');
    const expenseSlider = document.getElementById('expenseSlider');

    const incomeVal = document.getElementById('incomeVal');
    const expenseVal = document.getElementById('expenseVal');

    const netSavingsVal = document.getElementById('netSavingsVal');
    const savingsRateVal = document.getElementById('savingsRateVal');
    const projection1Yr = document.getElementById('projection1Yr');
    const projection5Yr = document.getElementById('projection5Yr');
    const healthStatus = document.getElementById('healthStatus');
    const healthAdvice = document.getElementById('healthAdvice');

    if (!incomeSlider || !expenseSlider) return;

    function formatRupiah(amount) {
        return 'Rp ' + Number(amount).toLocaleString('id-ID');
    }

    function calculate() {
        const income = parseInt(incomeSlider.value, 10);
        let expense = parseInt(expenseSlider.value, 10);

        // Update labels
        incomeVal.textContent = formatRupiah(income);
        expenseVal.textContent = formatRupiah(expense);

        const netSavings = income - expense;
        const savingsRate = income > 0 ? Math.round((netSavings / income) * 100) : 0;

        netSavingsVal.textContent = (netSavings >= 0 ? '+' : '') + formatRupiah(netSavings);
        netSavingsVal.className = 'metric-val ' + (netSavings >= 0 ? 'val-income' : 'val-expense');

        savingsRateVal.textContent = savingsRate + '%';
        savingsRateVal.className = 'metric-val ' + (savingsRate >= 20 ? 'val-income' : (savingsRate >= 10 ? '' : 'val-expense'));

        // Projections (with conservative 5% compound / simple annual)
        const yearlySavings = Math.max(0, netSavings * 12);
        const fiveYearSavings = Math.max(0, Math.round(yearlySavings * 5 * 1.08)); // modest 8% growth estimation

        projection1Yr.textContent = formatRupiah(yearlySavings);
        projection5Yr.textContent = formatRupiah(fiveYearSavings);

        // Status & Advice
        if (savingsRate >= 35) {
            healthStatus.innerHTML = '<span style="color: #10b981">🟢 Sangat Prima (Super Saver)</span>';
            healthAdvice.innerHTML = '<strong>Luar biasa!</strong> Rasio tabungan Anda di atas 35%. Anda berada di jalur cepat menuju kebebasan finansial (Financial Freedom). Pantau portofolio investasi Anda di FinTrack!';
        } else if (savingsRate >= 20) {
            healthStatus.innerHTML = '<span style="color: #10b981">🟢 Sehat & Ideal</span>';
            healthAdvice.innerHTML = '<strong>Bagus sekali!</strong> Anda memenuhi kaidah alokasi emas 50/30/20 (20% untuk tabungan & investasi). Gunakan FinTrack untuk menjaga konsistensi anggaran bulanan Anda.';
        } else if (savingsRate >= 10) {
            healthStatus.innerHTML = '<span style="color: #f59e0b">🟡 Cukup Baik (Perlu Optimasi)</span>';
            healthAdvice.innerHTML = '<strong>Cukup Sehat.</strong> Tabungan Anda 10-19%. Coba aktifkan <em>Peringatan Limit Harian FinTrack</em> untuk memangkas pengeluaran impulsif sebesar 5-10% lagi.';
        } else if (savingsRate > 0) {
            healthStatus.innerHTML = '<span style="color: #f59e0b">🟠 Rawan (Margin Tipis)</span>';
            healthAdvice.innerHTML = '<strong>Waspada:</strong> Margin sisa uang Anda sangat tipis (<10%). FinTrack dapat membantu menganalisis kategori apa yang paling banyak menyedot uang Anda.';
        } else {
            healthStatus.innerHTML = '<span style="color: #f43f5e">🔴 Defisit Finansial</span>';
            healthAdvice.innerHTML = '<strong>Perhatian Khusus!</strong> Pengeluaran melebihi pemasukan. Segera gunakan fitur <em>Kategori Kustom FinTrack</em> untuk memisahkan kebutuhan pokok dan memangkas biaya tidak perlu.';
        }
    }

    incomeSlider.addEventListener('input', calculate);
    expenseSlider.addEventListener('input', calculate);

    calculate();
}

/* --------------------------------------------------------------------------
   Dynamic Number Counters
   -------------------------------------------------------------------------- */
function initNumberCounters() {
    const animatedElements = document.querySelectorAll('.animate-counter');
    if (!animatedElements.length) return;

    const observer = new IntersectionObserver((entries, obs) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const el = entry.target;
                const target = parseInt(el.getAttribute('data-target') || '0', 10);
                const prefix = el.getAttribute('data-prefix') || '';
                const suffix = el.getAttribute('data-suffix') || '';
                let current = 0;
                const step = Math.max(1, Math.floor(target / 40));

                const timer = setInterval(() => {
                    current += step;
                    if (current >= target) {
                        current = target;
                        clearInterval(timer);
                    }
                    el.textContent = prefix + current.toLocaleString('id-ID') + suffix;
                }, 25);

                obs.unobserve(el);
            }
        });
    }, { threshold: 0.2 });

    animatedElements.forEach(el => observer.observe(el));
}
