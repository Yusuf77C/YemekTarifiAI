🍲 Yemek Tarifi AI Uygulaması

Bu proje, kullanıcıların günlük hayatlarını kolaylaştırmak için tasarlanmış **yapay zeka destekli bir yemek tarifi uygulamasıdır**.  
Uygulama, kullanıcıların elindeki malzemelere göre uygun yemek tarifleri önerir, tarifleri inceleme ve beğenme imkanı sunar. Ayrıca kullanıcı dostu arayüzü ile web ve mobilde entegre bir deneyim sağlar.  


<img width="1833" height="901" alt="Ekran görüntüsü 2025-05-25 235029" src="https://github.com/user-attachments/assets/32c05438-a25e-413e-be3c-e27d49109732" />


---

## 🎯 Genel Amaç
- Kullanıcıların **yemek tariflerini incelemesini** ve **yeni tarifler keşfetmesini** sağlamak.  
- Yapay zeka desteğiyle **kullanıcının elindeki malzemeler** ve **günlük ruh hali** gibi kriterlere göre kişiselleştirilmiş tarifler sunmak.  
- Kullanıcıların tarifleri **beğenmesi, puanlaması ve kendi kütüphanelerine eklemesi** için interaktif bir sistem kurmak.  
- Admin paneli üzerinden manuel olarak tarif ekleme olanağı sunmak.  

---

## ⚙️ Özellikler
- 👤 **Kullanıcı Girişi ve Kayıt Olma**  
  Kullanıcılar kayıt olduktan sonra giriş yapabilir, kişisel hesaplarıyla tarifleri görüntüleyebilir.  

- 📚 **Tarif İnceleme**  
  Uygulamada yer alan yemek tarifleri kategorilere ayrılmış şekilde görüntülenebilir.


<img width="1833" height="901" alt="Ekran görüntüsü 2025-05-25 235029" src="https://github.com/user-attachments/assets/e53af020-96ad-422b-a451-eb5858e62421" />



  <img width="1507" height="903" alt="Ekran görüntüsü 2025-05-25 151031" src="https://github.com/user-attachments/assets/c78dca68-b2e5-402a-a141-6b5f78ac25d7" />


- 🔎 **Detaylı Filtreleme**  
  Kullanıcılar aradıkları tarifi daha kolay bulmak için gelişmiş filtreleme yapabilir:  
  - ⏱️ **Süreye göre filtreleme** → Hızlı tarifler (15 dk), orta (30 dk), uzun (>1 saat).  
  - 🍝 **Yemek türüne göre filtreleme** → Çorba, ana yemek, tatlı, içecek vb.  
  - 📊 **Zorluk derecesine göre filtreleme** → Kolay, orta, zor.  
  - 🥗 **Beslenme tercihine göre filtreleme** → Vejetaryen, vegan, diyet, glütensiz.  


![WhatsApp Görsel 2025-09-05 saat 13 32 50_befdf39c](https://github.com/user-attachments/assets/6acdd3ae-fd5f-45fb-a02f-1b03f3d885f3)


- 🤖 **Yapay Zeka Tarif Önerileri**  
  - Kullanıcı elindeki malzemeleri girer.  
  - **Gemini AI** tabanlı asistan, uygun yemek tariflerini önerir.  
  - Günlük mod (ör. “hızlı yemek”, “diyet”, “keyif modu”) seçilerek öneriler daha da kişiselleştirilir.
 

  ![WhatsApp Görsel 2025-09-05 saat 13 23 12_c36c4e30](https://github.com/user-attachments/assets/24667887-1a59-4fdb-9a82-b8633514be4e)


- ❤️ **Beğenme ve Kütüphane**  
  Kullanıcılar beğendikleri tarifleri kütüphanelerine ekleyebilir ve daha sonra kolayca erişebilir.  

- ⭐ **Tarif Puanlama**  
  Tariflere 1–5 arasında puan verilerek topluluk tabanlı değerlendirme yapılabilir.  

- 🛠️ **Admin Paneli**  
  Admin, yeni yemek tariflerini manuel olarak ekleyebilir ve düzenleyebilir.  

- 📱 **Mobil Entegrasyon**  
  - Mobil uygulama **React Native (Expo Go)** ile geliştirilmiştir.  
  - Web ve mobil arasında senkronize bir kullanıcı deneyimi sağlar.  



![WhatsApp Görsel 2025-09-05 saat 13 21 29_c959c5a2](https://github.com/user-attachments/assets/59fce454-f475-47a9-929c-149e58001d92)

![WhatsApp Görsel 2025-09-05 saat 13 32 50_95fcab23](https://github.com/user-attachments/assets/ca1ef4ac-e8f8-4a04-a7d0-a498c93192a9)

- 🎨 **Kullanıcı Dostu Tasarım**  
  - Modern, sade ve erişilebilir bir arayüz.  
  - Web’de **React + TailwindCSS**, mobilde **NativeWind** ile desteklenmiş UI.  

---

## 🛠️ Kullanılan Teknolojiler
- **Frontend (Web):** React + JavaScript + TailwindCSS  
- **Mobil:** React Native (Expo Go)  
- **Backend:** Node.js + Express + TypeScript  
- **Veritabanı:** MongoDB Atlas  
- **Yapay Zeka:** Gemini AI API  
- **Kimlik Doğrulama:** JWT + Google OAuth  
- **Diğer:** Vercel (Web Deploy), Render (Backend), Expo (Mobil)  

---

## 🚀 Kurulum ve Çalıştırma

### 1. Depoyu Klonla
```bash
git clone <repo-link>
cd yemek-tarifi-ai
