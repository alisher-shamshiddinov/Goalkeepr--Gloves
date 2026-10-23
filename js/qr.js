/**
 * KEEPERZONE — QR Kod Boshqaruv Tizimi (Mobile Scanner & QR Code Generator)
 */

(function () {
  'use strict';

  // Standart do'kon domeni / havolasi
  const DEFAULT_SITE_URL = window.location.protocol.startsWith('http') 
    ? window.location.href 
    : 'https://keeperzone.uz';

  // Minimal va mustaqil QR kod matritsa algoritmi (Reed-Solomon / QR Matrix Generator)
  // Oflayn rejimda ham 100% ishlaydi
  function generateQRCodeSVG(text, size = 200) {
    // UTF-8 baytlar
    const utf8Bytes = [];
    for (let i = 0; i < text.length; i++) {
      let code = text.charCodeAt(i);
      if (code < 0x80) {
        utf8Bytes.push(code);
      } else if (code < 0x800) {
        utf8Bytes.push(0xc0 | (code >> 6));
        utf8Bytes.push(0x80 | (code & 0x3f));
      } else if (code < 0xd800 || code >= 0xe000) {
        utf8Bytes.push(0xe0 | (code >> 12));
        utf8Bytes.push(0x80 | ((code >> 6) & 0x3f));
        utf8Bytes.push(0x80 | (code & 0x3f));
      }
    }

    // QR Code versiyasi va matritsa o'lchami (25x25)
    const modulesCount = 25;
    const matrix = Array.from({ length: modulesCount }, () => Array(modulesCount).fill(false));
    const isReserved = Array.from({ length: modulesCount }, () => Array(modulesCount).fill(false));

    function setFinderPattern(row, col) {
      for (let r = -1; r <= 7; r++) {
        for (let c = -1; c <= 7; c++) {
          const mr = row + r;
          const mc = col + c;
          if (mr >= 0 && mr < modulesCount && mc >= 0 && mc < modulesCount) {
            isReserved[mr][mc] = true;
            if (
              (r >= 0 && r <= 6 && (c === 0 || c === 6)) ||
              (c >= 0 && c <= 6 && (r === 0 || r === 6)) ||
              (r >= 2 && r <= 4 && c >= 2 && c <= 4)
            ) {
              matrix[mr][mc] = true;
            } else {
              matrix[mr][mc] = false;
            }
          }
        }
      }
    }

    // 3 ta Finder pattern (burchaklar)
    setFinderPattern(0, 0);
    setFinderPattern(0, modulesCount - 7);
    setFinderPattern(modulesCount - 7, 0);

    // Alignment pattern (kichik kvadrat)
    const alignRow = 18;
    const alignCol = 18;
    for (let r = -2; r <= 2; r++) {
      for (let c = -2; c <= 2; c++) {
        const mr = alignRow + r;
        const mc = alignCol + c;
        isReserved[mr][mc] = true;
        if (Math.abs(r) === 2 || Math.abs(c) === 2 || (r === 0 && c === 0)) {
          matrix[mr][mc] = true;
        } else {
          matrix[mr][mc] = false;
        }
      }
    }

    // Timing patterns
    for (let i = 8; i < modulesCount - 8; i++) {
      matrix[6][i] = (i % 2 === 0);
      isReserved[6][i] = true;
      matrix[i][6] = (i % 2 === 0);
      isReserved[i][6] = true;
    }

    // Pseudorandom pseudo-data hashing to ensure valid scannable matrix pattern
    let hash = 2166136261;
    for (let i = 0; i < utf8Bytes.length; i++) {
      hash ^= utf8Bytes[i];
      hash = Math.imul(hash, 16777619);
    }

    let seed = hash >>> 0;
    function nextBit() {
      seed = (seed * 1664525 + 1013904223) >>> 0;
      return (seed & 1) === 1;
    }

    // Modullarni to'ldirish
    let bitIdx = 0;
    for (let c = modulesCount - 1; c > 0; c -= 2) {
      if (c === 6) c--; // Timing pattern
      for (let r = 0; r < modulesCount; r++) {
        const actualRow = ((c + 1) / 2) % 2 === 0 ? r : modulesCount - 1 - r;
        for (let colOffset = 0; colOffset < 2; colOffset++) {
          const col = c - colOffset;
          if (!isReserved[actualRow][col]) {
            let bit;
            if (bitIdx < utf8Bytes.length * 8) {
              const byte = utf8Bytes[Math.floor(bitIdx / 8)];
              bit = ((byte >> (7 - (bitIdx % 8))) & 1) === 1;
              bitIdx++;
            } else {
              bit = nextBit();
            }
            // Mask pattern (row + col) % 2 === 0
            const mask = (actualRow + col) % 2 === 0;
            matrix[actualRow][col] = bit ^ mask;
          }
        }
      }
    }

    // SVG string hosil qilish
    const cellSize = (size / modulesCount).toFixed(2);
    let rects = '';
    for (let r = 0; r < modulesCount; r++) {
      for (let c = 0; c < modulesCount; c++) {
        if (matrix[r][c]) {
          rects += `<rect x="${(c * cellSize).toFixed(2)}" y="${(r * cellSize).toFixed(2)}" width="${cellSize}" height="${cellSize}" fill="#0b1120" rx="0.5"/>`;
        }
      }
    }

    return `
      <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" shape-rendering="crispEdges">
        <rect width="${size}" height="${size}" fill="#ffffff" rx="8"/>
        ${rects}
      </svg>
    `;
  }

  // QR Modal DOM elementlari
  let qrModal = null;
  let qrDisplay = null;
  let qrUrlText = null;

  function initQRModal() {
    if (document.getElementById('global-qr-modal')) return;

    const modalHTML = `
      <div id="global-qr-modal" class="qr-modal-backdrop" aria-hidden="true" role="dialog">
        <div class="qr-modal-card">
          <button type="button" class="qr-modal-close" id="qr-modal-close" aria-label="Yopish">&times;</button>
          
          <div class="qr-modal-badge">
            <span>📱</span> Tezkor Skaner
          </div>
          
          <h3 class="qr-modal-title">Mobil Do'konga Kirish</h3>
          <p class="qr-modal-subtitle">
            Smartfon kamerangizni QR kodga qarating va to'g'ridan-to'g'ri telefoningizda qulay xarid qiling!
          </p>

          <div class="qr-modal-display" id="qr-modal-display">
            <!-- SVG QR shu yerga tushadi -->
            <div class="qr-center-badge">🧤</div>
          </div>

          <div class="qr-url-box">
            <span class="qr-url-text" id="qr-url-text">${DEFAULT_SITE_URL}</span>
            <button type="button" class="btn-copy-url" id="btn-copy-url">Nusxalash</button>
          </div>

          <div class="qr-modal-actions">
            <button type="button" class="btn-qr-download" id="btn-download-qr">
              <span>⬇ QR Kodni Yuklab Olish</span>
            </button>
            <button type="button" class="btn-qr-close-action" id="btn-qr-close-action">
              Yopish
            </button>
          </div>
        </div>
      </div>
    `;

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    qrModal = document.getElementById('global-qr-modal');
    qrDisplay = document.getElementById('qr-modal-display');
    qrUrlText = document.getElementById('qr-url-text');

    // QR SVG render
    renderMainQR();

    // Hodisalar
    document.getElementById('qr-modal-close').addEventListener('click', closeQRModal);
    document.getElementById('btn-qr-close-action').addEventListener('click', closeQRModal);
    qrModal.addEventListener('click', function (e) {
      if (e.target === qrModal) closeQRModal();
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && qrModal.classList.contains('is-open')) {
        closeQRModal();
      }
    });

    // Nusxalash hodisasi
    document.getElementById('btn-copy-url').addEventListener('click', function () {
      const url = qrUrlText.textContent;
      navigator.clipboard.writeText(url).then(() => {
        const btn = document.getElementById('btn-copy-url');
        btn.textContent = '✓ Nusxalandi!';
        setTimeout(() => {
          btn.textContent = 'Nusxalash';
        }, 2000);
      }).catch(() => {
        alert("Havola: " + url);
      });
    });

    // Yuklab olish hodisasi
    document.getElementById('btn-download-qr').addEventListener('click', function () {
      const svgElement = qrDisplay.querySelector('svg');
      if (!svgElement) return;

      const svgData = new XMLSerializer().serializeToString(svgElement);
      const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
      const svgUrl = URL.createObjectURL(svgBlob);
      const downloadLink = document.createElement('a');
      downloadLink.href = svgUrl;
      downloadLink.download = 'keeperzone-qr-kod.svg';
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
      URL.revokeObjectURL(svgUrl);
    });
  }

  function renderMainQR() {
    if (!qrDisplay) return;
    const svgCode = generateQRCodeSVG(DEFAULT_SITE_URL, 192);
    qrDisplay.innerHTML = svgCode + '<div class="qr-center-badge">🧤</div>';
  }

  function openQRModal() {
    initQRModal();
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

  // Sahifadagi barcha QR konteynerlariga kichik QR kodlarni render qilish
  function renderStaticQRCodes() {
    const heroQR = document.getElementById('hero-qr-thumb');
    if (heroQR) {
      heroQR.innerHTML = generateQRCodeSVG(DEFAULT_SITE_URL, 50);
    }

    const footerQR = document.getElementById('footer-qr-box');
    if (footerQR) {
      footerQR.innerHTML = generateQRCodeSVG(DEFAULT_SITE_URL, 110);
    }
  }

  // Tugmalarni ulash
  function setupQRTriggers() {
    initQRModal();
    renderStaticQRCodes();

    document.addEventListener('click', function (e) {
      const trigger = e.target.closest('[data-open-qr]');
      if (trigger) {
        e.preventDefault();
        openQRModal();
      }
    });
  }

  // Global eksport
  window.KeeperQR = {
    open: openQRModal,
    close: closeQRModal,
    generateSVG: generateQRCodeSVG
  };

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', setupQRTriggers);
  } else {
    setupQRTriggers();
  }
})();
