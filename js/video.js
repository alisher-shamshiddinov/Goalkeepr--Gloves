/**
 * KEEPERZONE — Har bir qo'lqop uchun video boshqaruv tizimi (Video Player & Catalog Integration)
 */

(function () {
  'use strict';

  // Har bir model uchun maxsus video ma'lumotlar bazasi (YouTube ID yoki mahalliy video fayl)
  const GLOVE_VIDEOS = {
    't1tan-petrol': {
      title: "T1tan Beast 3.0 Petrol Blue — Gecko Grip 4mm Lateks Sinovi",
      brand: "T1tan",
      videoId: "GtFfDZDgyM0",
      price: "1 290 000 so'm",
      numericPrice: 1290000,
      image: "images/t1tan-petrol-beast.png",
      name: "T1tan Beast 3.0 Petrol Blue",
      desc: "Germaniya T1tan brendining Gecko Grip lateksi va 3D neon silikon elementlari sinovi."
    },
    'nike-phantom-acc': {
      title: "Nike Phantom Elite ACC Orange — Professional Field Test",
      brand: "Nike",
      videoId: "TIKektvEACM",
      price: "1 750 000 so'm",
      numericPrice: 1750000,
      image: "images/nike-phantom-orange-acc.png",
      name: "Nike Phantom Elite ACC Orange",
      desc: "Har qanday ob-havoda yuqori natija beruvchi ACC texnologiyasi va Negative Cut bichimi."
    },
    'nike-vapor-volt': {
      title: "Nike Vapor Grip 3 Black Volt — Grip3 Texnologiyasi & Play Test",
      brand: "Nike",
      videoId: "w6r6Pn5N8ns",
      price: "1 620 000 so'm",
      numericPrice: 1620000,
      image: "images/nike-vapor-black-volt.png",
      name: "Nike Vapor Grip 3 Black Volt",
      desc: "Grip3 patentlangan o'rash tizimi, Contact Plus lateksi va qulay moslashuvchanlik."
    },
    'usport-speed-orange': {
      title: "U Sport Speed Contact Fluo Orange — Supergrip+ Sharhi",
      brand: "U Sport",
      videoId: "CSTxjZdNvxI",
      price: "1 480 000 so'm",
      numericPrice: 1480000,
      image: "images/usport-speed-orange.png",
      name: "U Sport Speed Contact Fluo",
      desc: "Germaniya Supergrip+ formulasi, HN Negative Cut va yuqori darajadagi yopishqoqlik."
    },
    'usport-hyperflex': {
      title: "U Sport Hyperflex Absolutgrip Navy — Germaniya Absolutgrip Sinovi",
      brand: "U Sport",
      videoId: "irb9SBgY1lg",
      price: "1 350 000 so'm",
      numericPrice: 1350000,
      image: "images/usport-hyperflex-navy.png",
      name: "U Sport Hyperflex Absolutgrip",
      desc: "Afsonaviy Absolutgrip lateksi, 3D sariq rebound webbing va mustahkam amortizatsiya."
    },
    'adidas-ice-blue': {
      title: "Adidas Predator Pro Ice Blue — High Definition Grip Test",
      brand: "Adidas",
      videoId: "eH0Z1YgTqG8",
      price: "1 720 000 so'm",
      numericPrice: 1720000,
      image: "images/adidas-predator-ice-blue.png",
      name: "Adidas Predator Pro Ice Blue",
      desc: "URG 2.0 lateksi, orqa tarafdagi High Definition Grip silikon qovurg'alari va strapless korpus."
    },
    'adidas-solar-red': {
      title: "Adidas Predator Solar Red — Rasmiy Match Day URG 1.0 Sinovi",
      brand: "Adidas",
      videoId: "d6y6U15m9G0",
      price: "1 850 000 so'm",
      numericPrice: 1850000,
      image: "images/adidas-predator-solar-red.png",
      name: "Adidas Predator Solar Red",
      desc: "Professional o'yinlar uchun maxsus URG 1.0 Match lateksi va kuchli zarbani qaytarish tizimi."
    },
    't1tan-blackout': {
      title: "T1tan Beast 3.0 Blackout Neon — Monster Grip Sharhi",
      brand: "T1tan",
      videoId: "_oOqtBIlBPY",
      price: "1 320 000 so'm",
      numericPrice: 1320000,
      image: "images/t1tan-beast-blackout-neon.png",
      name: "T1tan Beast 3.0 Blackout",
      desc: "Black Gecko 4mm lateks, qorong'i blackout dizayn va neon silikon zarba tikanlari."
    },
    'spire-cream-sand': {
      title: "Spire Phantom Elite Sand — Contact Sand 4mm Obzori",
      brand: "Spire",
      videoId: "vV-l3jYqJ4Y",
      price: "950 000 so'm",
      numericPrice: 950000,
      image: "images/spire-phantom-cream-sand.png",
      name: "Spire Phantom Elite Sand",
      desc: "Elegant krem rang, Contact Sand 4mm lateksi va qulay Negative/Roll gibrid bichim."
    },
    'spire-air-black': {
      title: "Spire Air Pro Black & White — Negative Cut & Havo Aylanishi",
      brand: "Spire",
      videoId: "sW2h8Y1mKgA",
      price: "990 000 so'm",
      numericPrice: 990000,
      image: "images/spire-air-pro-black.png",
      name: "Spire Air Pro Black & White",
      desc: "Nafas oluvchi elastik AIR cuff, German Contact 4mm lateksi va yengil korpus."
    },
    'ks-hero-yellow': {
      title: "KS Hero 4mm Super Glue Yellow — O'ta Yopishqoq Lateks Sinovi",
      brand: "KS Hero",
      videoId: "kXm8tG5rJ7o",
      price: "1 380 000 so'm",
      numericPrice: 1380000,
      image: "images/ks-hero-superglue-yellow.png",
      name: "KS Hero 4mm Super Glue Yellow",
      desc: "Super Glue 4mm qora tomchili maxsus yopishqoq kaft lateksi va neon yellow dizayn."
    },
    'ks-hero-red': {
      title: "KS Hero 4mm Super Glue Red — Lava Red & Black Lateks Sharhi",
      brand: "KS Hero",
      videoId: "yK8hG1mF_5g",
      price: "1 380 000 so'm",
      numericPrice: 1380000,
      image: "images/ks-hero-superglue-red.png",
      name: "KS Hero 4mm Super Glue Red",
      desc: "Olovrang korpus, kuchli barmoq himoyasi va Super Glue Black maxsus formulasi."
    }
  };

  // DOM elementlari
  let modalBackdrop = null;
  let modalContainer = null;
  let modalTitle = null;
  let modalBrand = null;
  let modalFrame = null;
  let modalPrice = null;
  let modalCartBtn = null;
  let currentProductData = null;

  // Video modal HTML ni dinamik yaratish (agar mavjud bo'lmasa)
  function initVideoModal() {
    if (document.getElementById('global-video-modal')) {
      return;
    }

    const modalHTML = `
      <div id="global-video-modal" class="video-modal-backdrop" aria-hidden="true" role="dialog">
        <div class="video-modal-container">
          <div class="video-modal-header">
            <div class="video-header-info">
              <span class="video-brand-pill" id="video-brand-pill">BREND</span>
              <h3 class="video-modal-title" id="video-modal-title">Model Videosi</h3>
            </div>
            <button type="button" class="video-close-btn" id="video-close-btn" aria-label="Videoni yopish">&times;</button>
          </div>
          
          <div class="video-frame-wrapper" id="video-frame-wrapper">
            <!-- Iframe yoki Video shu yerga yuklanadi -->
          </div>

          <div class="video-modal-footer">
            <div class="video-footer-meta">
              <span id="video-footer-desc" style="max-width: 480px; font-size: 12px; line-height: 1.4;"></span>
              <strong id="video-footer-price">0 so'm</strong>
            </div>
            <div class="video-footer-actions">
              <button type="button" class="btn-video-cart" id="video-add-to-cart">
                <span>🛒 Savatga qo'shish</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    modalBackdrop = document.getElementById('global-video-modal');
    modalContainer = modalBackdrop.querySelector('.video-modal-container');
    modalTitle = document.getElementById('video-modal-title');
    modalBrand = document.getElementById('video-brand-pill');
    modalFrame = document.getElementById('video-frame-wrapper');
    modalPrice = document.getElementById('video-footer-price');
    modalCartBtn = document.getElementById('video-add-to-cart');

    // Yopish hodisalari
    document.getElementById('video-close-btn').addEventListener('click', closeVideo);
    modalBackdrop.addEventListener('click', function (e) {
      if (e.target === modalBackdrop) {
        closeVideo();
      }
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
        closeVideo();
      }
    });

    // Savatga qo'shish hodisasi
    modalCartBtn.addEventListener('click', function () {
      if (currentProductData) {
        // window.cartManager yoki cart.js dagi savat funksiyasini chaqirish
        const event = new CustomEvent('add-to-cart-external', {
          detail: {
            id: currentProductData.id,
            name: currentProductData.name,
            price: currentProductData.numericPrice,
            image: currentProductData.image,
            brand: currentProductData.brand
          }
        });
        window.dispatchEvent(event);

        // Agar cart.js savat tugmasi orqali qabul qilsa
        const cartBtn = document.querySelector(`.btn-add-cart[data-id="${currentProductData.id}"]`);
        if (cartBtn) {
          cartBtn.click();
        }
      }
    });
  }

  // Videoni ochish
  function openVideo(productId) {
    initVideoModal();
    const data = GLOVE_VIDEOS[productId];
    if (!data) {
      console.warn('Video topilmadi:', productId);
      return;
    }

    currentProductData = Object.assign({ id: productId }, data);

    modalTitle.textContent = data.title;
    modalBrand.textContent = data.brand;
    modalPrice.textContent = data.price;
    document.getElementById('video-footer-desc').textContent = data.desc;

    // YouTube iframe yaratish (autoplay bilan)
    modalFrame.innerHTML = `
      <iframe 
        src="https://www.youtube.com/embed/${data.videoId}?autoplay=1&rel=0&modestbranding=1" 
        title="${data.title}" 
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" 
        allowfullscreen>
      </iframe>
    `;

    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  // Videoni yopish va to'xtatish
  function closeVideo() {
    if (!modalBackdrop) return;
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    // Iframe ni tozalash (video ovozi to'xtashi uchun)
    if (modalFrame) {
      modalFrame.innerHTML = '';
    }
    currentProductData = null;
  }

  // DOM yuklanganda kartochkalar va modallarga video tugmalarini biriktirish
  function setupVideoTriggers() {
    initVideoModal();

    // Kartochkalardagi va modallardagi barcha video ochuvchi tugmalar
    document.addEventListener('click', function (e) {
      const videoTrigger = e.target.closest('[data-video-id]');
      if (videoTrigger) {
        e.preventDefault();
        e.stopPropagation();
        const productId = videoTrigger.getAttribute('data-video-id');
        openVideo(productId);
      }
    });
  }

  // Global eksport
  window.GloveVideos = {
    open: openVideo,
    close: closeVideo,
    data: GLOVE_VIDEOS
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupVideoTriggers);
  } else {
    setupVideoTriggers();
  }
})();
