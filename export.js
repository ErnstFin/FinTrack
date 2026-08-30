// ==========================================================================
// Ngaturuang (FinTrack) - Financial Data Export Engine (PDF & Excel XLSX)
// ==========================================================================

class ExportManager {
    /**
     * Export financial transactions and summary to PDF
     * @param {string|null} startDate - YYYY-MM-DD or null for all-time
     * @param {string|null} endDate - YYYY-MM-DD or null for all-time
     */
    exportToPDF(startDate = null, endDate = null) {
        try {
            if (!window.jspdf || !window.jspdf.jsPDF) {
                if (window.app) window.app.showToast('Library jsPDF belum termuat!', 'error');
                return;
            }

            const { jsPDF } = window.jspdf;
            const doc = new jsPDF();
            
            // Get transactions
            let transactions = [];
            let periodText = 'Semua Riwayat Transaksi';
            
            if (startDate && endDate) {
                transactions = storage.getTransactionsByDateRange(startDate, endDate);
                periodText = `${this.formatDate(startDate)} - ${this.formatDate(endDate)}`;
            } else {
                transactions = storage.getAllTransactions();
            }

            if (!transactions || transactions.length === 0) {
                if (window.app) window.app.showToast('Tidak ada transaksi untuk diekspor pada periode ini!', 'warning');
                return;
            }

            // Calculate totals
            const income = transactions.filter(t => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount || 0), 0);
            const expense = transactions.filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount || 0), 0);
            const balance = income - expense;

            // Brand Header & Title
            doc.setFillColor(16, 185, 129); // Primary emerald
            doc.rect(0, 0, 210, 26, 'F');

            doc.setTextColor(255, 255, 255);
            doc.setFontSize(18);
            doc.setFont(undefined, 'bold');
            doc.text('FinTrack — Laporan Keuangan Pribadi', 105, 12, { align: 'center' });
            
            doc.setFontSize(10);
            doc.setFont(undefined, 'normal');
            doc.text(`Periode: ${periodText}  |  Dibuat: ${new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}`, 105, 20, { align: 'center' });

            // Summary Section Box
            doc.setTextColor(15, 23, 42);
            doc.setFontSize(13);
            doc.setFont(undefined, 'bold');
            doc.text('Ringkasan Arus Kas', 14, 38);

            // Summary Cards Background
            doc.setFillColor(248, 250, 252);
            doc.setDrawColor(226, 232, 240);
            doc.roundedRect(14, 42, 182, 28, 3, 3, 'FD');

            // Total Income
            doc.setFontSize(9);
            doc.setFont(undefined, 'bold');
            doc.setTextColor(16, 185, 129);
            doc.text('TOTAL PEMASUKAN', 20, 50);
            doc.setFontSize(12);
            doc.text(`Rp ${income.toLocaleString('id-ID')}`, 20, 60);

            // Total Expense
            doc.setFontSize(9);
            doc.setTextColor(244, 63, 94);
            doc.text('TOTAL PENGELUARAN', 80, 50);
            doc.setFontSize(12);
            doc.text(`Rp ${expense.toLocaleString('id-ID')}`, 80, 60);

            // Net Balance
            doc.setFontSize(9);
            doc.setTextColor(balance >= 0 ? 16 : 244, balance >= 0 ? 185 : 63, balance >= 0 ? 129 : 94);
            doc.text('SALDO BERSIH (NET)', 140, 50);
            doc.setFontSize(12);
            doc.text(`Rp ${balance.toLocaleString('id-ID')}`, 140, 60);

            // Transactions Table
            const tableData = transactions.map((t, idx) => {
                const category = storage.getCategoryById(t.category);
                return [
                    (idx + 1).toString(),
                    this.formatDate(t.date),
                    t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
                    category ? `${category.icon || ''} ${category.name}` : '-',
                    (t.type === 'income' ? '+ ' : '- ') + 'Rp ' + Number(t.amount).toLocaleString('id-ID'),
                    t.note || '-'
                ];
            });

            doc.autoTable({
                startY: 76,
                head: [['No', 'Tanggal', 'Tipe', 'Kategori', 'Nominal', 'Catatan / Deskripsi']],
                body: tableData,
                styles: {
                    fontSize: 8.5,
                    cellPadding: 3.5,
                    font: 'helvetica'
                },
                headStyles: {
                    fillColor: [16, 185, 129],
                    textColor: [255, 255, 255],
                    fontStyle: 'bold',
                    halign: 'center'
                },
                alternateRowStyles: {
                    fillColor: [248, 250, 252]
                },
                columnStyles: {
                    0: { halign: 'center', cellWidth: 12 },
                    1: { halign: 'center', cellWidth: 26 },
                    2: { halign: 'center', cellWidth: 26 },
                    3: { halign: 'left', cellWidth: 38 },
                    4: { halign: 'right', cellWidth: 34, fontStyle: 'bold' },
                    5: { halign: 'left' }
                },
                didParseCell: function(data) {
                    if (data.section === 'body' && data.column.index === 4) {
                        const rowType = tableData[data.row.index][2];
                        if (rowType === 'Pemasukan') {
                            data.cell.styles.textColor = [16, 185, 129];
                        } else {
                            data.cell.styles.textColor = [244, 63, 94];
                        }
                    }
                }
            });

            // Category Breakdown Table if multiple categories exist
            const categoryBreakdown = this.getCategoryBreakdown(transactions);
            if (categoryBreakdown.length > 0) {
                const finalY = doc.lastAutoTable.finalY + 12;
                if (finalY < 240) {
                    doc.setFontSize(11);
                    doc.setTextColor(15, 23, 42);
                    doc.setFont(undefined, 'bold');
                    doc.text('Rincian Alokasi Kategori', 14, finalY);

                    const catTableData = categoryBreakdown.map(c => [
                        c.Tipe,
                        c.Kategori,
                        c['Jumlah Transaksi'] + 'x',
                        'Rp ' + Number(c.Total).toLocaleString('id-ID')
                    ]);

                    doc.autoTable({
                        startY: finalY + 4,
                        head: [['Tipe', 'Kategori', 'Frekuensi', 'Total Nominal']],
                        body: catTableData,
                        styles: { fontSize: 8, cellPadding: 2.5 },
                        headStyles: { fillColor: [30, 41, 59] },
                        columnStyles: {
                            0: { halign: 'center', cellWidth: 30 },
                            2: { halign: 'center', cellWidth: 30 },
                            3: { halign: 'right', cellWidth: 40, fontStyle: 'bold' }
                        }
                    });
                }
            }

            // Page Numbering in Footer
            const pageCount = doc.internal.getNumberOfPages();
            for (let i = 1; i <= pageCount; i++) {
                doc.setPage(i);
                doc.setFontSize(8);
                doc.setTextColor(148, 163, 184);
                doc.text(
                    `FinTrack Pro — Halaman ${i} dari ${pageCount}  |  Dokumen Resmi Laporan Finansial`,
                    105,
                    290,
                    { align: 'center' }
                );
            }

            // Save PDF
            const fileDateStr = startDate && endDate ? `${startDate}_sd_${endDate}` : 'semua_data';
            const fileName = `Laporan_Keuangan_FinTrack_${fileDateStr}.pdf`;
            doc.save(fileName);
            
            if (window.app) window.app.showToast('Laporan PDF berhasil diunduh!', 'success');
        } catch (error) {
            console.error('PDF export error:', error);
            if (window.app) window.app.showToast('Gagal membuat laporan PDF: ' + error.message, 'error');
        }
    }

    /**
     * Export financial transactions and breakdown to Excel (.xlsx)
     * @param {string|null} startDate - YYYY-MM-DD or null for all-time
     * @param {string|null} endDate - YYYY-MM-DD or null for all-time
     */
    exportToExcel(startDate = null, endDate = null) {
        try {
            if (!window.XLSX) {
                if (window.app) window.app.showToast('Library SheetJS (Excel) belum termuat!', 'error');
                return;
            }

            let transactions = [];
            let periodText = 'Semua Waktu';

            if (startDate && endDate) {
                transactions = storage.getTransactionsByDateRange(startDate, endDate);
                periodText = `${this.formatDate(startDate)} s/d ${this.formatDate(endDate)}`;
            } else {
                transactions = storage.getAllTransactions();
            }

            if (!transactions || transactions.length === 0) {
                if (window.app) window.app.showToast('Tidak ada transaksi untuk diekspor ke Excel!', 'warning');
                return;
            }

            // 1. Transactions Sheet
            const excelData = transactions.map((t, idx) => {
                const category = storage.getCategoryById(t.category);
                return {
                    'No': idx + 1,
                    'Tanggal': this.formatDate(t.date),
                    'Tipe': t.type === 'income' ? 'Pemasukan' : 'Pengeluaran',
                    'Kategori': category ? category.name : 'Tanpa Kategori',
                    'Nominal (Rp)': t.amount,
                    'Catatan': t.note || '-'
                };
            });

            // 2. Summary Sheet
            const income = transactions.filter(t => t.type === 'income')
                .reduce((sum, t) => sum + Number(t.amount || 0), 0);
            const expense = transactions.filter(t => t.type === 'expense')
                .reduce((sum, t) => sum + Number(t.amount || 0), 0);
            const balance = income - expense;

            const summaryData = [
                { 'Parameter': 'Aplikasi', 'Nilai': 'Ngaturuang (FinTrack Pro)' },
                { 'Parameter': 'Periode Laporan', 'Nilai': periodText },
                { 'Parameter': 'Tanggal Export', 'Nilai': new Date().toLocaleString('id-ID') },
                { 'Parameter': 'Total Jumlah Transaksi', 'Nilai': transactions.length },
                { 'Parameter': 'Total Pemasukan (Rp)', 'Nilai': income },
                { 'Parameter': 'Total Pengeluaran (Rp)', 'Nilai': expense },
                { 'Parameter': 'Saldo Bersih (Rp)', 'Nilai': balance }
            ];

            // 3. Category Breakdown Sheet
            const categoryBreakdown = this.getCategoryBreakdown(transactions);

            // Build Workbook
            const wb = XLSX.utils.book_new();
            
            const wsSummary = XLSX.utils.json_to_sheet(summaryData);
            XLSX.utils.book_append_sheet(wb, wsSummary, 'Ringkasan');

            const wsTransactions = XLSX.utils.json_to_sheet(excelData);
            XLSX.utils.book_append_sheet(wb, wsTransactions, 'Daftar Transaksi');

            const wsCategory = XLSX.utils.json_to_sheet(categoryBreakdown);
            XLSX.utils.book_append_sheet(wb, wsCategory, 'Analisis Kategori');

            // Save XLSX File
            const fileDateStr = startDate && endDate ? `${startDate}_sd_${endDate}` : 'semua_data';
            const fileName = `Laporan_Keuangan_FinTrack_${fileDateStr}.xlsx`;
            XLSX.writeFile(wb, fileName);
            
            if (window.app) window.app.showToast('Laporan Excel (.xlsx) berhasil diunduh!', 'success');
        } catch (error) {
            console.error('Excel export error:', error);
            if (window.app) window.app.showToast('Gagal membuat file Excel: ' + error.message, 'error');
        }
    }

    /**
     * Unified Export Dispatcher based on user choice
     * @param {string} format - 'pdf' | 'xlsx'
     * @param {string} period - 'all' | 'this-month' | 'this-year' | 'custom'
     * @param {string|null} customStart
     * @param {string|null} customEnd
     */
    exportFinancialData(format = 'pdf', period = 'all', customStart = null, customEnd = null) {
        let startDate = null;
        let endDate = null;

        const now = new Date();
        if (period === 'this-month') {
            const start = new Date(now.getFullYear(), now.getMonth(), 1);
            startDate = start.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
        } else if (period === 'this-year') {
            const start = new Date(now.getFullYear(), 0, 1);
            startDate = start.toISOString().split('T')[0];
            endDate = now.toISOString().split('T')[0];
        } else if (period === 'custom') {
            startDate = customStart;
            endDate = customEnd;
            if (!startDate || !endDate) {
                if (window.app) window.app.showToast('Silakan tentukan tanggal mulai dan akhir!', 'warning');
                return;
            }
        }

        if (format === 'xlsx' || format === 'excel') {
            this.exportToExcel(startDate, endDate);
        } else {
            this.exportToPDF(startDate, endDate);
        }
    }

    // ========================================
    // Helpers
    // ========================================
    getCategoryBreakdown(transactions) {
        const categoryMap = {};
        
        transactions.forEach(t => {
            const category = storage.getCategoryById(t.category);
            const categoryName = category ? category.name : 'Tanpa Kategori';
            const type = t.type === 'income' ? 'Pemasukan' : 'Pengeluaran';
            const key = `${type} - ${categoryName}`;
            
            if (!categoryMap[key]) {
                categoryMap[key] = {
                    'Tipe': type,
                    'Kategori': categoryName,
                    'Total Nominal (Rp)': 0,
                    'Jumlah Transaksi': 0
                };
            }
            
            categoryMap[key]['Total Nominal (Rp)'] += Number(t.amount || 0);
            categoryMap[key]['Jumlah Transaksi']++;
        });
        
        return Object.values(categoryMap);
    }

    formatDate(dateString) {
        if (!dateString) return '-';
        const date = new Date(dateString);
        if (isNaN(date.getTime())) return dateString;
        return date.toLocaleDateString('id-ID', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric'
        });
    }
}

// Global instance
const exportManager = new ExportManager();
