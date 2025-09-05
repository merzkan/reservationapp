# Rezervasyon Yönetim Sistemi

Modern ve kullanıcı dostu bir rezervasyon yönetim sistemi. Bu proje, kullanıcıların randevu alabilmesi ve yöneticilerin bu randevuları yönetebilmesi için geliştirilmiş bir web uygulamasıdır.

## 🚀 Özellikler

### Kullanıcı Özellikleri
- **Kayıt Olma ve Giriş Yapma**: Güvenli kullanıcı kimlik doğrulama sistemi
- **Şifre Sıfırlama**: E-posta ile şifre sıfırlama özelliği
- **Rezervasyon Oluşturma**: Tarih ve saat seçerek randevu alma
- **Rezervasyon Görüntüleme**: Mevcut randevuları görüntüleme ve yönetme
- **Rezervasyon İptal Etme**: Aktif randevuları iptal etme

### Yönetici Özellikleri
- **Kullanıcı Yönetimi**: Tüm kullanıcıları görüntüleme ve yönetme
- **Rezervasyon Yönetimi**: Tüm randevuları görüntüleme ve durum güncelleme
- **Sistem Ayarları**: Çalışma saatleri ve günlerini yapılandırma
- **Dashboard**: Kapsamlı yönetim paneli

### Teknik Özellikler
- **Güvenlik**: JWT tabanlı kimlik doğrulama, bcrypt şifreleme
- **Rate Limiting**: API güvenliği için istek sınırlama
- **CORS**: Cross-origin istekler için güvenlik
- **Helmet**: HTTP güvenlik başlıkları

## 🛠️ Teknoloji Stack

### Backend
- **Node.js** - JavaScript runtime
- **Express.js 5.1.0** - Web framework
- **MongoDB** - NoSQL veritabanı
- **Mongoose 8.17.1** - MongoDB object modeling
- **JWT 9.0.2** - JSON Web Token authentication
- **bcrypt 6.0.0** - Şifre hashleme
- **Nodemailer 7.0.5** - E-posta gönderimi
- **Helmet 8.1.0** - Güvenlik middleware
- **CORS 2.8.5** - Cross-origin resource sharing
- **Express Rate Limit 8.0.1** - API rate limiting
- **dotenv 17.2.1** - Environment variables

### Frontend
- **React 19.1.1** - UI library
- **Vite 7.1.2** - Build tool ve development server
- **Material-UI (MUI) 7.3.1** - UI component library
- **MUI X Data Grid 8.10.0** - Advanced data tables
- **MUI X Date Pickers 8.10.0** - Date/time picker components
- **React Router DOM 7.8.0** - Client-side routing
- **Axios 1.11.0** - HTTP client
- **date-fns 4.1.0** - Tarih işlemleri
- **Emotion** - CSS-in-JS styling

## 📁 Proje Yapısı

```
proje/
├── backend/                # Backend API
│   ├── app.js              # Ana uygulama dosyası
│   ├── package.json        # Backend bağımlılıkları
│   ├── config/
│   │   └── db.js           # Veritabanı bağlantı konfigürasyonu
│   ├── controller/         # İş mantığı kontrolcüleri
│   │   ├── authcontrol.js  # Kimlik doğrulama kontrolcüsü
│   │   ├── homecontrol.js  # Ana sayfa kontrolcüsü
│   │   ├── logincontrol.js # Giriş kontrolcüsü
│   │   ├── registercontrol.js # Kayıt kontrolcüsü
│   │   ├── reservationcontrol.js # Rezervasyon kontrolcüsü
│   │   ├── settingcontrol.js # Ayar kontrolcüsü
│   │   └── userscontrol.js # Kullanıcı kontrolcüsü
│   ├── middleware/         # Middleware'ler
│   │   ├── auth.js         # JWT doğrulama middleware
│   │   ├── cors.js         # CORS konfigürasyonu
│   │   ├── logger.js       # Loglama middleware
│   │   └── security.js     # Güvenlik middleware
│   ├── models/             # Veritabanı modelleri
│   │   ├── user.js         # Kullanıcı modeli
│   │   ├── reservation.js  # Rezervasyon modeli
│   │   └── setting.js      # Ayar modeli
│   ├── router/             # API route'ları
│   │   ├── auth.js         # Kimlik doğrulama route'ları
│   │   ├── home.js         # Ana sayfa route'ları
│   │   ├── login.js        # Giriş route'ları
│   │   ├── register.js     # Kayıt route'ları
│   │   ├── reservation.js  # Rezervasyon route'ları
│   │   ├── setting.js      # Ayar route'ları
│   │   └── users.js        # Kullanıcı route'ları
│   └── utils/
│       └── mailer.js       # E-posta gönderim yardımcısı
└── frontend/               # React frontend uygulaması
├── package.json        # Frontend bağımlılıkları
├── vite.config.js      # Vite konfigürasyonu
├── vercel.json         # Vercel deployment konfigürasyonu
├── eslint.config.js    # ESLint konfigürasyonu
├── index.html          # HTML template
└── src/
├── api/            # API çağrıları
│   ├── api.js      # Ana API konfigürasyonu
│   ├── apiAdmin.js # Admin API çağrıları
│   ├── apiSetting.js # Ayar API çağrıları
│   └── apiUser.js  # Kullanıcı API çağrıları
├── components/     # React bileşenleri
│   ├── AdminPage/  # Yönetici sayfaları
│   │   ├── AdminLayout.jsx
│   │   ├── reservationAdmin.jsx
│   │   ├── setting.jsx
│   │   ├── usersTable.jsx
│   │   └── settings/
│   ├── HomePage/   # Ana sayfa bileşenleri
│   │   ├── home.jsx
│   │   ├── login.jsx
│   │   ├── register.jsx
│   │   ├── forgotpassword.jsx
│   │   └── resetpassword.jsx
│   ├── Navbar/     # Navigasyon bileşenleri
│   │   ├── navbar.jsx
│   │   ├── HomeNavbar.jsx
│   │   ├── UserNavbar.jsx
│   │   ├── AdminNavbar.jsx
│   │   └── search.jsx
│   ├── UserPage/   # Kullanıcı sayfaları
│   │   ├── reservation.jsx
│   │   └── reservationed.jsx
│   └── layout.jsx  # Ana layout bileşeni
├── App.jsx         # Ana React bileşeni
├── main.jsx        # Uygulama giriş noktası
└── index.css       # Global CSS stilleri
```

## 🚀 Kurulum ve Çalıştırma
### Projeyi Klonlama
Projeyi GitHub’dan bilgisayarınıza klonlayın ve proje klasörüne girin:
```bash
git clone https://github.com/kullanici-adiniz/repo-adi.git
cd repo-adi
```

### Gereksinimler
- Node.js (v16 veya üzeri)
- MongoDB
- npm veya yarn

### Backend Kurulumu

1. Backend dizinine gidin:
```bash
cd backend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment değişkenlerini ayarlayın:
`.env` dosyası oluşturun ve aşağıdaki değişkenleri ekleyin:
```env
# Sunucu portu
PORT=YOUR_PORT

# MongoDB bağlantı URL'si
MONGO_URL=YOUR_MONGODB_URL

# JWT secret key
SECRET_KEY=YOUR_SECRET_KEY_HERE

# SMTP e-posta kullanıcı bilgisi
SMTP_USER=YOUR_EMAIL_USER
SMTP_PASS=YOUR_EMAIL_APP_PASSWORD

# Gönderici e-posta adresi
FROM_EMAIL=YOUR_EMAIL_ADDRESS

# Local uygulama URL
LOCAL_URL=YOUR_LOCAL_URL

# Frontend URL
FRONTEND_URL=YOUR_FRONTEND_URL
```

4. Backend'i başlatın:
```bash
npm start
```

### Frontend Kurulumu

1. Frontend dizinine gidin:
```bash
cd frontend
```

2. Bağımlılıkları yükleyin:
```bash
npm install
```

3. Environment değişkenlerini ayarlayın:
`.env` dosyası oluşturun:
```env
VITE_API_BASE_URL=your_url
```

4. Development server'ı başlatın:
```bash
npm run dev
```

## 📚 API Endpoints

### Ana Sayfa
- `GET /` - Ana sayfa bilgileri

### Kimlik Doğrulama
- `GET /login` - Login sayfası bilgileri
- `POST /login` - Kullanıcı girişi
- `GET /register` - Register sayfası bilgileri
- `POST /register` - Kullanıcı kaydı
- `POST /forgot-password` - Şifre sıfırlama isteği
- `POST /reset-password/:token` - Şifre sıfırlama

### Rezervasyon
- `POST /reservation` - Yeni rezervasyon oluştur (Auth gerekli)
- `GET /reservation/user` - Kullanıcının rezervasyonları (Auth gerekli)
- `GET /reservation/all` - Belirli tarihteki rezervasyonlar (Auth gerekli, query: date)
- `GET /reservation/all-user` - Tüm rezervasyonlar (Admin, Auth gerekli)
- `GET /reservation/user/:userId` - Belirli kullanıcının rezervasyonları (Auth gerekli)
- `PATCH /reservation/:id/status` - Rezervasyon durumu güncelle (Auth gerekli)
- `PATCH /reservation/cancel/:id` - Rezervasyon iptal et (Auth gerekli)

### Kullanıcı Yönetimi
- `GET /users` - Tüm kullanıcılar (Admin, Auth gerekli, query: page, limit)
- `GET /users/search` - Kullanıcı arama (Admin, Auth gerekli, query: q, page, limit)
- `PUT /users/update/:id` - Kullanıcı güncelle (Admin, Auth gerekli)
- `DELETE /users/delete/:id` - Kullanıcı sil (Admin, Auth gerekli)

### Ayarlar
- `GET /setting` - Sistem ayarları
- `POST /setting` - Ayar güncelle (Admin)
- `PATCH /setting/:id` - Belirli ayar güncelle (Admin)

## 🔐 Güvenlik

- **JWT Authentication**: Güvenli token tabanlı kimlik doğrulama
- **Password Hashing**: bcrypt ile şifre hashleme
- **Rate Limiting**: API isteklerini sınırlama
- **CORS**: Cross-origin güvenlik
- **Helmet**: HTTP güvenlik başlıkları
- **Input Validation**: Giriş verilerinin doğrulanması

## 🚀 Deployment

### Vercel (Frontend)
Frontend uygulaması Vercel'e deploy edilmiştir.


### Backend Deployment
Backend uygulaması Render ile deplot edilmiştir.

## 📝 Geliştirme Notları
- Proje modern JavaScript/ES6+ standartlarını kullanır
- Component-based React mimarisi
- RESTful API tasarımı
- MongoDB ile NoSQL veritabanı
- JWT tabanlı stateless authentication
- Material-UI ile modern ve responsive tasarım
- Vite ile hızlı development ve build süreci
- Express Rate Limiting ile API güvenliği
- Role-based access control (Admin/User)

## 🏗️ Proje Detayları

### Veritabanı Modelleri

#### User Model
- `name`: Kullanıcı adı
- `surname`: Kullanıcı soyadı  
- `email`: E-posta adresi (unique)
- `password`: Hashlenmiş şifre
- `isAdmin`: Admin yetkisi (boolean)
- `passwordResetVersion`: Şifre sıfırlama versiyonu

#### Reservation Model
- `userId`: Kullanıcı referansı
- `date`: Rezervasyon tarihi
- `time`: Rezervasyon saati
- `note`: Rezervasyon notu
- `status`: Durum (aktif/iptal/tamamlandı)
- `createdAt`: Oluşturulma tarihi

#### Setting Model
- `dayOfWeek`: Haftanın günü
- `isOpen`: Açık/kapalı durumu
- `openTime`: Açılış saati
- `closeTime`: Kapanış saati
- `slotDuration`: Slot süresi (dakika)

#### Exception Model
- `date`: Tek günlük istisna tarihi
- `startDate`: Başlangıç tarihi (aralık)
- `endDate`: Bitiş tarihi (aralık)
- `startTime`:  Başlangıç saati 
- `endTime`: Bitiş saati