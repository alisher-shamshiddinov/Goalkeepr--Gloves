# 🧤 KEEPERZONE — Darvozabonlar Qo'lqoplari Do'koni

Darvozabonlar uchun professional qo'lqoplar internet-do'koni. **12 ta haqiqiy fotosuratli professional modellar**, qulay **Interaktiv Savat (Shopping Cart)** va **To'liq Summa (Total Price)** hisoblash tizimi bilan to'liq jihozlangan.

---

## 🛒 Yangi Savat va To'liq Summa Imkoniyatlari:
1. **Har bir mahsulotda "Savatga" tugmasi**:
   - Katalogdagi har bir qo'lqop kartochkasida va batafsil ko'rish modalida `+ Savatga` / `🛒 Savatga qo'shish` tugmalari mavjud.
2. **Navbardagi Savat ko'rsatkichi**:
   - Tovar soni (dinamik badge) va ayni damdagi jami to'liq summa (`X XXX XXX so'm`) doimiy yangilanib turadi.
3. **Suzuvchi (Floating) Savat tugmasi**:
   - Sahifaning pastki o'ng burchagida qulay suzuvchi tugma bo'lib, mobil va kompyuterda darhol savatni ochish va to'liq summani ko'rish imkonini beradi.
4. **Zamonaviy Savat Paneli (Drawer / Modal)**:
   - Tanlangan barcha tovarlar ro'yxati (rasmi, nomi, donasi narxi, miqdori `[ - ]` `[ + ]`, har bir tovar bo'yicha oraliq summa va o'chirish tugmasi).
   - **TO'LIQ TO'LOV SUMMASI (JAMI)**: Maxsus yorqin ramkada katta ko'rsatiladi.
   - Savatni tozalash va to'g'ridan-to'g'ri "Buyurtmani Rasmiylashtirish" tugmalari.
5. **Buyurtma bo'limidagi hisobot bloki**:
   - Savatdagi barcha tovarlar va ularning **TO'LIQ SUMMASI** buyurtma formasining tepasida ko'rsatiladi va formaga avtomatik bog'lanadi.
6. **Xotirada saqlanish (LocalStorage)**:
   - Sahifa yangilansa (F5) ham savatdagi tovarlar va to'liq summa yo'qolib ketmaydi.
7. **Toast Xabarnomalar**:
   - Tovarlar savatga qo'shilganda chiroyli vizual xabarlar chiqadi.

---

## 🌟 Kiritilgan Brendlar va Modellar (Faqat Haqiqiy Fotosuratlar):

### 1. **T1tan (Titan)**
- **T1tan Beast 3.0 Petrol Blue** ("Be The Titan" 4mm Gecko Grip latex, Negative Cut)
- **T1tan Beast 3.0 Blackout Neon** (4mm Monster Grip latex, Hybrid Cut, Punch Zone)

### 2. **U Sport (Uhlsport)**
- **U Sport Speed Contact Fluo Orange** (Supergrip+ latex, HN Negative Cut)
- **U Sport Hyperflex Absolutgrip Navy / Lime** (Absolutgrip latex, Classic Flat Cut)

### 3. **Spire Gloves**
- **Spire Phantom Elite Sand (Krem)** (4mm Contact Latex, Negative Cut)
- **Spire Air Pro Black & White** (4mm Aqua Latex, Roll Finger Cut, Air Mesh)

### 4. **Adidas**
- **Adidas Predator Pro Ice Blue / Volt** (URG 2.0 latex, Negative Cut, High-Definition Grip)
- **Adidas Predator Solar Red** (URG 1.0 latex, Hybrid Cut, Demonskin Elements)

### 5. **Nike**
- **Nike Phantom Elite ACC Fluo Orange** (ACC All Conditions Control, Negative Cut)
- **Nike Vapor Grip 3 Black Volt** (Contact Plus Foam, Grip3 texnologiyasi)

### 6. **KS Hero (KeeperSport)**
- **KS Hero Superglue Neon Sariq** (4mm Superglue Grip latex, Negative Cut)
- **KS Hero Superglue Qizil / Qora** (4mm Superglue Grip latex, Hybrid Roll Cut)

---

## ⚙️ Sof CSS da Qanday Ishlaydi?
1. **Brendlar bo'yicha saralash (CSS Filter):**
   - Maxsus yashirin radio tugmalar (`<input type="radio" class="radio-filter">`) va CSS selektorlari (`#filter-ks:checked ~ ... .brand-ks`) yordamida JavaScript'siz filtrlash ishlaydi.
2. **Tezkor ko'rish (CSS Modallar):**
   - CSS `:target` pseudo-klassi orqali ishlaydi (`#modal-...`). Har bir qo'lqopning to'liq parametrlari va fotosuratlari ochiladi va `&times;` orqali yopiladi.
3. **O'lcham jadvali (Size Guide):**
   - Bolalar, o'smirlar va kattalar uchun qo'lqop o'lchamini santimetrda aniqlash jadvali.
4. **Lateksni to'g'ri yuvish va asrash (Glove Care):**
   - Pre-wash, o'yindan oldin namlash va quritish qoidalari.
5. **Buyurtma berish formasi:**
   - HTML5 forma boshqaruvi va 12 ta model tanlovi.

---

## 📂 Fayllar Strukturasi
```
Goalkeeps glove/
│
├── index.html              # Bosh sahifa (100% toza HTML5, nol JavaScript, 12 ta mahsulot)
├── css/
│   └── styles.css          # Sof CSS3 (Grid, Flexbox, :target modallar, radio filter, responsive)
├── images/                 # Yuklangan 12 ta haqiqiy fotosurat (PNG)
│   ├── t1tan-petrol-beast.png
│   ├── t1tan-beast-blackout-neon.png
│   ├── usport-speed-orange.png
│   ├── usport-hyperflex-navy.png
│   ├── spire-phantom-cream-sand.png
│   ├── spire-air-pro-black.png
│   ├── adidas-predator-ice-blue.png
│   ├── adidas-predator-solar-red.png
│   ├── nike-phantom-orange-acc.png
│   ├── nike-vapor-black-volt.png
│   ├── ks-hero-superglue-yellow.png
│   └── ks-hero-superglue-red.png
└── README.md               # Qo'llanma
```

---

## 🚀 Ishga tushirish
Hech qanday server, terminal yoki dastur o'rnatish shart emas. Shunchaki `index.html` faylini istalgan brauzerda (Chrome, Edge, Firefox, Safari) oching!
