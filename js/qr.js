/**
 * KEEPERZONE — Tezkor QR Kod Tizimi (Instant QR Code & Scanner)
 * Foydalanuvchi QR kodi (images/qr-code.png) va dinamik QR generator integratsiyasi.
 */

(function () {
  'use strict';

  // Foydalanuvchi taqdim etgan original QR kod rasmi
  const ORIGINAL_QR_IMAGE = 'images/qr-code.png';

  // Standart QR havolasi (Netlify jonli sayt domeni)
  const DEFAULT_SITE_URL = 'https://goalkeeprgloves.netlify.app';

  let currentQRUrl = DEFAULT_SITE_URL;
  let isCustomUrl = false; // Foydalanuvchi havolani tahrirladimi?
  let showLaser = true;

  /**
   * Standart QR kod SVG yaratish (dinamik holat uchun)
   */
  function generateQRCodeSVG(text, size = 200, ecc = 'M') {
    if (typeof qrcode !== 'function') {
      return `<img src="${ORIGINAL_QR_IMAGE}" alt="QR Kod" style="width:100%; height:100%; object-fit:contain;" />`;
    }

    try {
      const qr = qrcode(0, ecc);
      qr.addData(text || DEFAULT_SITE_URL, 'Byte');
      qr.make();

      const moduleCount = qr.getModuleCount();
      const margin = 2;
      const totalModules = moduleCount + margin * 2;
      const cellSize = size / totalModules;

      let pathData = '';
      for (let r = 0; r < moduleCount; r++) {
        for (let c = 0; c < moduleCount; c++) {
          if (qr.isDark(r, c)) {
            const x = (c + margin) * cellSize;
            const y = (r + margin) * cellSize;
            pathData += `M${x.toFixed(2)},${y.toFixed(2)}h${cellSize.toFixed(2)}v${cellSize.toFixed(2)}h-${cellSize.toFixed(2)}z `;
          }
        }
      }

      return `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">
          <rect width="100%" height="100%" fill="#ffffff" rx="10"/>
          <path d="${pathData}" fill="#0b1120"/>
        </svg>
      `;
    } catch (e) {
      console.error('QR yaratishda xatolik:', e);
      return `<img src="${ORIGINAL_QR_IMAGE}" alt="QR Kod" style="width:100%; height:100%; object-fit:contain;" />`;
    }
  }

  /**
   * PNG formatda QR kodni yuklab olish
   */
  function downloadPNG() {
    if (!isCustomUrl) {
      // Original sifatli QR rasmini yuklab olish
      const a = document.createElement('a');
      a.href = ORIGINAL_QR_IMAGE;
      a.download = 'keeperzone-qr.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      showToast('✓ Original QR Kod (PNG) yuklab olindi!');
      return;
    }

    // Agar havola o'zgartirilgan bo'lsa, canvas orqali yangi PNG yaratamiz
    if (typeof qrcode === 'function') {
      try {
        const qr = qrcode(0, 'M');
        qr.addData(currentQRUrl, 'Byte');
        qr.make();
        const moduleCount = qr.getModuleCount();
        const margin = 3;
        const totalModules = moduleCount + margin * 2;
        const size = 640;
        const canvas = document.createElement('canvas');
        canvas.width = size;
        canvas.height = size;
        const ctx = canvas.getContext('2d');

        ctx.fillStyle = '#ffffff';
        ctx.fillRect(0, 0, size, size);

        const cellSize = size / totalModules;
        ctx.fillStyle = '#0b1120';
        for (let r = 0; r < moduleCount; r++) {
          for (let c = 0; c < moduleCount; c++) {
            if (qr.isDark(r, c)) {
              ctx.fillRect(
                Math.round((c + margin) * cellSize),
                Math.round((r + margin) * cellSize),
                Math.ceil(cellSize),
                Math.ceil(cellSize)
              );
            }
          }
        }

        const dataUrl = canvas.toDataURL('image/png');
        const link = document.createElement('a');
        link.href = dataUrl;
        link.download = 'keeperzone-qr.png';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        showToast('✓ Yangilangan QR Kod (PNG) yuklab olindi!');
      } catch (e) {
        console.error('Canvas export error:', e);
      }
    }
  }

  // Toast bildirishnoma
  function showToast(msg) {
    let toast = document.getElementById('qr-toast-notice');
    if (!toast) {
      toast = document.createElement('div');
      toast.id = 'qr-toast-notice';
      toast.className = 'qr-toast-notice';
      document.body.appendChild(toast);
    }
    toast.textContent = msg;
    toast.classList.add('show');
    clearTimeout(toast._timeout);
    toast._timeout = setTimeout(() => {
      toast.classList.remove('show');
    }, 2400);
  }

  // Modal elementlari
  let qrModal = null;
  let qrDisplay = null;
  let qrUrlText = null;
  let qrUrlInput = null;
  let laserLine = null;

  function initQRModal() {
    if (document.getElementById('global-qr-modal')) return;

    const modalHTML = `
      <div id="global-qr-modal" class="qr-modal-backdrop" aria-hidden="true" role="dialog">
        <div class="qr-modal-card">
          <button type="button" class="qr-modal-close" id="qr-modal-close" aria-label="Yopish">&times;</button>
          
          <div class="qr-modal-header">
            <div class="qr-modal-badge">
              <span class="qr-pulse-dot"></span>
              <span>⚡ Tezkor QR Tizimi</span>
            </div>
            <h3 class="qr-modal-title">Mobil Do'konga Kirish</h3>
            <p class="qr-modal-subtitle">
              Smartfoningiz kamerasini QR kodga qarating — sahifa <strong>bir lahzada</strong> ochiladi!
            </p>
          </div>

          <!-- Tezkor Asboblar -->
          <div class="qr-quick-toolbar">
            <button type="button" class="qr-tool-btn is-active" id="btn-toggle-laser" title="Skaner animatsiyasini yoqish/o'chirish">
              <span class="icon">⚡</span> <span class="label">Skaner nuri</span>
            </button>
            <button type="button" class="qr-tool-btn" id="btn-reset-qr" title="Asl QR kodni tiklash">
              <span class="icon">🔄</span> <span class="label">Asl QR Kod</span>
            </button>
          </div>

          <!-- QR Kod Vitrinasi -->
          <div class="qr-modal-display-wrapper">
            <div class="qr-modal-display" id="qr-modal-display">
              <img id="qr-main-image" src="${ORIGINAL_QR_IMAGE}" alt="Do'kon QR Kodi" style="width:100%; height:100%; object-fit:contain; border-radius:10px; display:block;" />
            </div>
            <div class="qr-scanner-laser" id="qr-scanner-laser"></div>
          </div>

          <!-- Havola qatori va tahrirlash -->
          <div class="qr-url-box">
            <div class="qr-url-info">
              <span class="qr-url-label">Havola:</span>
              <span class="qr-url-text" id="qr-url-text" title="${DEFAULT_SITE_URL}">${DEFAULT_SITE_URL}</span>
              <input type="text" class="qr-url-input" id="qr-url-input" value="${DEFAULT_SITE_URL}" style="display:none;" placeholder="https://..." />
            </div>
            <div class="qr-url-actions">
              <button type="button" class="btn-url-tool" id="btn-edit-url" title="Havolani o'zgartirish">✏️</button>
              <button type="button" class="btn-copy-url" id="btn-copy-url">Nusxalash</button>
            </div>
          </div>

          <!-- Asosiy Harakatlar -->
          <div class="qr-modal-actions">
            <button type="button" class="btn-qr-download btn-qr-png" id="btn-download-png">
              <span>📥 QR Kodni Yuklab Olish</span>
            </button>
            <a href="${DEFAULT_SITE_URL}" target="_blank" rel="noopener noreferrer" class="btn-open-link" id="btn-open-link" title="Brauzerda yangi tabda ochish">
              <span>🌐 Ochish</span>
            </a>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    qrModal = document.getElementById('global-qr-modal');
    qrDisplay = document.getElementById('qr-modal-display');
    qrUrlText = document.getElementById('qr-url-text');
    qrUrlInput = document.getElementById('qr-url-input');
    laserLine = document.getElementById('qr-scanner-laser');

    // Hodisalar
    document.getElementById('qr-modal-close').addEventListener('click', closeQRModal);
    qrModal.addEventListener('click', function (e) {
      if (e.target === qrModal) closeQRModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && qrModal.classList.contains('is-open')) {
        closeQRModal();
      }
    });

    // Lazer nuri
    const laserBtn = document.getElementById('btn-toggle-laser');
    laserBtn.addEventListener('click', function () {
      showLaser = !showLaser;
      this.classList.toggle('is-active', showLaser);
      if (laserLine) laserLine.style.display = showLaser ? 'block' : 'none';
    });

    // Asl QR kodni tiklash
    document.getElementById('btn-reset-qr').addEventListener('click', function () {
      isCustomUrl = false;
      currentQRUrl = DEFAULT_SITE_URL;
      if (qrUrlText) qrUrlText.textContent = DEFAULT_SITE_URL;
      if (qrUrlInput) qrUrlInput.value = DEFAULT_SITE_URL;
      const openLink = document.getElementById('btn-open-link');
      if (openLink) openLink.href = DEFAULT_SITE_URL;
      renderQR();
      showToast('✓ Asl QR kod tiklandi');
    });

    // Tahrirlash
    const editBtn = document.getElementById('btn-edit-url');
    editBtn.addEventListener('click', function () {
      if (qrUrlInput.style.display === 'none') {
        qrUrlText.style.display = 'none';
        qrUrlInput.style.display = 'block';
        qrUrlInput.focus();
        qrUrlInput.select();
        editBtn.textContent = '💾';
      } else {
        const val = qrUrlInput.value.trim() || DEFAULT_SITE_URL;
        updateCustomUrl(val);
        qrUrlInput.style.display = 'none';
        qrUrlText.style.display = 'block';
        editBtn.textContent = '✏️';
      }
    });

    qrUrlInput.addEventListener('input', function () {
      updateCustomUrl(this.value.trim() || DEFAULT_SITE_URL);
    });

    qrUrlInput.addEventListener('keydown', function (e) {
      if (e.key === 'Enter') editBtn.click();
    });

    // Nusxalash
    document.getElementById('btn-copy-url').addEventListener('click', function () {
      const url = currentQRUrl;
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(url).then(() => {
          showToast('✓ Havola nusxalandi!');
        }).catch(() => fallbackCopy(url));
      } else {
        fallbackCopy(url);
      }
    });

    function fallbackCopy(url) {
      const tempInput = document.createElement('input');
      tempInput.value = url;
      document.body.appendChild(tempInput);
      tempInput.select();
      document.execCommand('copy');
      document.body.removeChild(tempInput);
      showToast('✓ Havola nusxalandi!');
    }

    // Yuklab olish
    document.getElementById('btn-download-png').addEventListener('click', downloadPNG);
  }

  function updateCustomUrl(url) {
    currentQRUrl = url;
    isCustomUrl = (url !== DEFAULT_SITE_URL);
    if (qrUrlText) {
      qrUrlText.textContent = url;
      qrUrlText.title = url;
    }
    const openLink = document.getElementById('btn-open-link');
    if (openLink) openLink.href = url;
    renderQR();
  }

  function renderQR() {
    if (!qrDisplay) return;
    if (!isCustomUrl) {
      qrDisplay.innerHTML = `<img id="qr-main-image" src="${ORIGINAL_QR_IMAGE}" alt="Do'kon QR Kodi" style="width:100%; height:100%; object-fit:contain; border-radius:10px; display:block;" />`;
    } else {
      qrDisplay.innerHTML = generateQRCodeSVG(currentQRUrl, 210, 'M');
    }
  }

  function openQRModal() {
    initQRModal();
    renderQR();
    qrModal.classList.add('is-open');
    qrModal.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  }

  function closeQRModal() {
    if (!qrModal) return;
    qrModal.classList.remove('is-open');
    qrModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  }

  function setupStaticQRElements() {
    initQRModal();

    // Tugmalarni tinglash
    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-open-qr]');
      if (trigger) {
        e.preventDefault();
        openQRModal();
      }
    });
  }

  // Global ob'ekt
  window.KeeperQR = {
    open: openQRModal,
    close: closeQRModal,
    download: downloadPNG,
    setUrl: updateCustomUrl
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupStaticQRElements);
  } else {
    setupStaticQRElements();
  }
})();
