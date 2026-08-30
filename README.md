# 💰 FinTrack - Aplikasi Pencatat Keuangan Pribadi

Aplikasi web progresif (PWA) untuk mengelola keuangan pribadi dengan fitur lengkap dan modern.

## ✨ Fitur Utama

### 📊 Dashboard Interaktif
- Tampilan saldo total, pemasukan, dan pengeluaran
- Grafik pengeluaran bulanan dengan Chart.js
- Grafik kategori pengeluaran (pie chart)
- Daftar transaksi terbaru

### 💳 Manajemen Transaksi
- Tambah, edit, dan hapus transaksi
- Kategori yang dapat dikustomisasi
- Filter berdasarkan tipe dan kategori
- Catatan untuk setiap transaksi
- Periode view: harian, mingguan, bulanan, tahunan

### 🏷️ Kategori Kustom
- Kategori pemasukan (Gaji, Bonus, Freelance, Investasi, dll.)
- Kategori pengeluaran (Makanan, Transport, Belanja, Tagihan, dll.)
- Tambah kategori baru dengan icon emoji dan warna
- Edit dan hapus kategori

### 📈 Laporan Keuangan
- Generate laporan berdasarkan periode
- Export ke PDF dengan format profesional
- Export ke Excel (.xlsx) dengan multiple sheets
- Breakdown per kategori

### ☁️ Sinkronisasi Cloud
- Sinkronisasi otomatis ke cloud storage
- Backup data otomatis
- Akses dari berbagai device
- Status sync real-time

### ⚠️ Notifikasi & Reminder
- Peringatan budget harian
- Notifikasi ketika pengeluaran mendekati limit (80%)
- Push notifications (PWA)

### 🌓 Dark Mode
- Toggle dark/light mode
- Mengikuti preferensi sistem otomatis
- Transisi smooth antar tema
- Variabel CSS untuk konsistensi

### 📱 Progressive Web App (PWA)
- Install sebagai aplikasi native
- Offline support dengan Service Worker
- Responsive design untuk mobile & desktop
- Fast loading dengan cache strategy

### 💾 Manajemen Data
- Export Laporan & Data Keuangan (Format PDF & Excel .xlsx)
- Pilihan periode export (Semua waktu, bulan ini, tahun ini, atau kustom)
- Clear all data & reset
- Local storage dengan IndexedDB fallback

## 🚀 Cara Menggunakan

### Instalasi Lokal

1. **Clone atau Download**
   ```bash
   # Download folder Ngaturuang
   # Atau clone repository jika ada
   ```

2. **Buka dengan Browser**
   - Buka file `index.html` dengan browser modern
   - Atau gunakan local server:
     ```bash
     # Dengan Python
     python -m http.server 8000
     
     # Dengan Node.js
     npx serve
     
     # Dengan PHP
     php -S localhost:8000
     ```

3. **Akses Aplikasi & Landing Page**
   - **Landing Page Profil Projek**: Buka `landing.html` untuk ringkasan fitur, kalkulator kesehatan finansial interaktif, dan FAQ.
   - **Aplikasi FinTrack**: Buka `index.html` langsung untuk mencatat transaksi dan mengelola keuangan.

### Deploy ke Hosting

#### Vercel
```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
vercel
```

#### Netlify
- Drag & drop folder Ngaturuang ke Netlify Drop
- Atau connect dengan Git repository

#### GitHub Pages
1. Upload folder ke GitHub repository
2. Enable GitHub Pages di Settings
3. Pilih branch dan folder
4. Akses via `https://username.github.io/repo-name`

## 📖 Panduan Pengguna

### Menambah Transaksi
1. Klik tombol "➕ Tambah Transaksi"
2. Pilih tipe (Pemasukan/Pengeluaran)
3. Pilih kategori
4. Masukkan jumlah, tanggal, dan catatan
5. Klik "Simpan"

### Membuat Kategori Baru
1. Buka menu "🏷️ Kategori"
2. Klik "➕ Tambah Kategori"
3. Pilih tipe, nama, icon emoji, dan warna
4. Klik "Simpan"

### Mengatur Anggaran Harian
1. Buka menu "⚙️ Pengaturan"
2. Masukkan limit pengeluaran harian
3. Klik "Simpan"
4. Dashboard akan menampilkan peringatan jika mendekati limit

### Export Laporan
1. Buka menu "📈 Laporan"
2. Pilih periode (dari tanggal - sampai tanggal)
3. Klik "Generate"
4. Klik "📄 Export PDF" atau "📊 Export Excel"

### Sinkronisasi Cloud
1. Buka menu "⚙️ Pengaturan"
2. Masukkan email untuk cloud storage
3. Klik "Hubungkan"
4. Data akan otomatis sync setiap 5 menit

### Install sebagai App
1. Klik tombol install yang muncul di browser
2. Atau klik icon "+" di address bar
3. Konfirmasi instalasi
4. App akan muncul di home screen/start menu

## 🛠️ Teknologi

- **Frontend**: HTML5, CSS3 (CSS Variables), Vanilla JavaScript
- **Charts**: Chart.js 4.4.0
- **PDF Export**: jsPDF 2.5.1 + AutoTable
- **Excel Export**: SheetJS (xlsx) 0.20.1
- **PWA**: Service Worker, Web App Manifest
- **Storage**: LocalStorage + IndexedDB (fallback)
- **Responsive**: CSS Grid & Flexbox

## 📱 Kompatibilitas

### Browser Support
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+
- ✅ Opera 76+

### Device Support
- ✅ Desktop (Windows, macOS, Linux)
- ✅ Mobile (Android, iOS)
- ✅ Tablet (iPad, Android Tablet)

### PWA Features
- ✅ Install to Home Screen
- ✅ Offline Support
- ✅ Background Sync
- ✅ Push Notifications
- ✅ App Shortcuts

## 🎨 Kustomisasi

### Mengubah Warna Tema
Edit `styles.css` bagian CSS Variables:
```css
:root {
    --color-primary: #4CAF50;  /* Warna utama */
    --color-secondary: #2196F3; /* Warna sekunder */
    /* ... */
}
```

### Menambah Bahasa
Edit file JavaScript untuk menambah translations:
```javascript
const translations = {
    id: { /* Indonesia */ },
    en: { /* English */ }
};
```

### Mengubah Icon
Ganti file di folder `icons/` dengan icon custom Anda (format PNG, berbagai ukuran).

## 🔒 Privasi & Keamanan

- ✅ Data tersimpan lokal di browser Anda
- ✅ Tidak ada tracking atau analytics
- ✅ Tidak ada data yang dikirim ke server pihak ketiga
- ✅ Cloud sync menggunakan enkripsi (saat implementasi real)
- ✅ Export data dalam format standar (JSON, PDF, Excel)

## 🐛 Troubleshooting

### Data Tidak Muncul
- Clear browser cache
- Check LocalStorage: Developer Tools → Application → LocalStorage
- Try import backup data

### Chart Tidak Muncul
- Pastikan koneksi internet (untuk load Chart.js CDN)
- Check browser console untuk error
- Reload halaman

### Export Gagal
- Pastikan koneksi internet (untuk load library)
- Check browser console
- Coba browser lain

### PWA Tidak Bisa Install
- Gunakan HTTPS atau localhost
- Pastikan manifest.json dan service-worker.js accessible
- Check browser compatibility

## 📝 Roadmap

### V1.1 (Planned)
- [ ] Multi-currency support
- [ ] Recurring transactions
- [ ] Budget per kategori
- [ ] Data analytics & insights
- [ ] Goal tracking (tabungan)

### V1.2 (Future)
- [ ] Multi-user/family accounts
- [ ] Receipt scanning (OCR)
- [ ] Bank account integration
- [ ] Investment tracking
- [ ] Cryptocurrency support

### V2.0 (Long-term)
- [ ] Backend dengan Node.js/Firebase
- [ ] Real-time sync antar device
- [ ] Sharing & collaboration
- [ ] AI-powered insights
- [ ] API untuk third-party apps

## 🤝 Kontribusi

Aplikasi ini open untuk improvement! Anda dapat:
1. Fork repository
2. Buat feature branch
3. Commit changes
4. Push ke branch
5. Buat Pull Request

## 📄 Lisensi

MIT License - Free to use, modify, and distribute.

## 👨‍💻 Developer

Dibuat dengan ❤️ untuk membantu mengelola keuangan pribadi dengan lebih baik.

## 📞 Support

Jika ada pertanyaan atau masalah:
- Check dokumentasi di file ini
- Lihat kode sumber untuk detail implementasi
- Buat issue di repository (jika ada)

---

**Ngaturuang** - Kelola uang, atur masa depan! 💰✨
