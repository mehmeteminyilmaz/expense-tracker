📊 Expense Tracker (Harcama Takip Uygulaması)
Harcamalarınızı kolayca yönetmenizi, kategorize etmenizi ve bütçenizi kontrol altında tutmanızı sağlayan modern bir web uygulamasıdır. Kullanıcı dostu arayüzü sayesinde günlük finansal hareketlerinizi takip edebilir ve harcama alışkanlıklarınızı grafiklerle analiz edebilirsiniz.

✨ Özellikler
Harcama Yönetimi: Yeni harcama ekleme, mevcut harcamaları düzenleme veya silme (CRUD).

Kategorizasyon: Harcamaları Yemek, Ulaşım, Eğlence, Alışveriş gibi kategorilere ayırma.

Filtreleme: Belirli kategorilere göre harcamaları anlık olarak süzme.

Veri Görselleştirme: Chart.js kütüphanesi ile haftalık veya aylık harcama dağılımını gösteren interaktif grafikler.

Özet Paneli: Toplam harcama miktarını ve bütçe durumunu anlık görüntüleme.

Gerçek Zamanlı Veri: Firebase entegrasyonu ile verilerin anlık senkronizasyonu.

🚀 Kullanılan Teknolojiler
Bu proje, modern web teknolojileri ve best-practice prensipleri kullanılarak geliştirilmiştir:

Frontend: React.js

Backend: Node.js & Express

Veritabanı: Firebase (Firestore)

Grafik: Chart.js

Stil: CSS3 / Tailwind CSS 

🛠️ Kurulum ve Çalıştırma
Projeyi yerel bilgisayarınızda çalıştırmak için aşağıdaki adımları izleyebilirsiniz:

Depoyu klonlayın:

Bash
git clone https://github.com/kullaniciadi/expense-tracker.git
Bağımlılıkları yükleyin:

Bash
# Frontend için
cd client
npm install

# Backend için
cd server
npm install
Firebase Yapılandırması:
.env dosyasını oluşturun ve Firebase API anahtarlarınızı ekleyin.

Uygulamayı başlatın:

Bash
npm start
