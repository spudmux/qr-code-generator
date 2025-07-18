document.addEventListener('DOMContentLoaded', function() {
  const urlInput = document.getElementById('url-input');
  const includeUrlCheckbox = document.getElementById('include-url');
  const textAbove = document.getElementById('text-above');
  const textBelow = document.getElementById('text-below');
  const qrcodeContainer = document.getElementById('qrcode');
  const downloadBtn = document.getElementById('download-btn');
  const copyLinkBtn = document.getElementById('copy-link-btn');
  const clearBtn = document.getElementById('clear-btn');
  let urlInImageDiv = document.getElementById('url-in-image');
  if (!urlInImageDiv) {
    urlInImageDiv = document.createElement('div');
    urlInImageDiv.id = 'url-in-image';
    urlInImageDiv.style.wordBreak = 'break-all';
    urlInImageDiv.style.fontSize = '1em';
    urlInImageDiv.style.color = '#444';
    urlInImageDiv.style.marginTop = '0.5em';
    textBelow.parentNode.insertBefore(urlInImageDiv, textBelow.nextSibling);
  }
  const displayToggle = document.getElementById('display-toggle');
  const imageOverlay = document.getElementById('image-overlay');
  const overlayImg = document.getElementById('overlay-img');
  const closeOverlayBtn = document.getElementById('close-overlay');
  let selectedEmoji = '';
  const emojiPicker = document.getElementById('emoji-picker');
  const emojiOverlay = document.getElementById('emoji-overlay');
  if (emojiPicker) {
    emojiPicker.addEventListener('click', function(e) {
      if (e.target.classList.contains('emoji-btn')) {
        selectedEmoji = e.target.dataset.emoji || '';
        // Highlight selected
        Array.from(emojiPicker.querySelectorAll('.emoji-btn')).forEach(btn => btn.classList.remove('selected'));
        e.target.classList.add('selected');
        updateAll();
        updateEmojiOverlay();
        updateUrlParams();
      }
    });
  }

  function clearQRCode() {
    qrcodeContainer.innerHTML = '';
    downloadBtn.disabled = true;
    urlInImageDiv.textContent = '';
  }

  function getCleanText(el) {
    return (el.textContent || '').replace(/\s+$/g, '').replace(/\n{2,}/g, '\n');
  }

  function updateUrlInImagePreview() {
    if (includeUrlCheckbox.checked && urlInput.value.trim()) {
      urlInImageDiv.textContent = urlInput.value.trim();
      urlInImageDiv.style.display = '';
    } else {
      urlInImageDiv.textContent = '';
      urlInImageDiv.style.display = 'none';
    }
  }

  function generateQRCode(url) {
    clearQRCode();
    if (!url) return;
    qr = new QRCode(qrcodeContainer, {
      text: url,
      width: 256,
      height: 256,
      colorDark: '#000000',
      colorLight: '#ffffff',
      correctLevel: QRCode.CorrectLevel.H
    });
    setTimeout(() => {
      downloadBtn.disabled = false;
      if (displayToggle && displayToggle.checked) {
        const dataUrl = generateImageDataUrl();
        if (dataUrl) {
          overlayImg.src = dataUrl;
          imageOverlay.style.display = '';
          document.body.style.overflow = 'hidden';
        }
      }
    }, 200); // Wait for QR to render
  }

  function updateAll() {
    const url = urlInput.value.trim();
    generateQRCode(url);
    updateUrlInImagePreview();
    updateUrlParams();
    updateEmojiOverlay();
  }

  function updateUrlParams() {
    const params = new URLSearchParams();
    if (urlInput.value.trim()) params.set('url', urlInput.value.trim());
    if (getCleanText(textAbove)) params.set('above', getCleanText(textAbove));
    if (getCleanText(textBelow)) params.set('below', getCleanText(textBelow));
    if (includeUrlCheckbox.checked) params.set('showurl', '1');
    else params.delete('showurl');
    if (displayToggle && displayToggle.checked) params.set('display', '1');
    else params.delete('display');
    if (selectedEmoji) params.set('emoji', selectedEmoji);
    else params.delete('emoji');
    // Use full path for GitHub Pages compatibility
    const newUrl = window.location.pathname + (params.toString() ? '?' + params.toString() : '') + window.location.hash;
    window.history.replaceState({}, '', newUrl);
  }

  function loadFromUrlParams() {
    const params = new URLSearchParams(window.location.search);
    if (params.has('url')) urlInput.value = params.get('url');
    if (params.has('above')) textAbove.textContent = params.get('above');
    if (params.has('below')) textBelow.textContent = params.get('below');
    includeUrlCheckbox.checked = params.get('showurl') === '1';
    if (displayToggle) displayToggle.checked = params.get('display') === '1';
    selectedEmoji = params.get('emoji') || '';
    // Update emoji picker highlight
    if (emojiPicker) {
      Array.from(emojiPicker.querySelectorAll('.emoji-btn')).forEach(btn => {
        if (btn.dataset.emoji === selectedEmoji) btn.classList.add('selected');
        else btn.classList.remove('selected');
      });
    }
    updateEmojiOverlay();
  }

  function generateImageDataUrl() {
    const url = urlInput.value.trim();
    if (!url) return null;
    const above = getCleanText(textAbove);
    const below = getCleanText(textBelow);
    const includeUrl = includeUrlCheckbox.checked;
    const emoji = selectedEmoji;
    const size = 256;
    const padding = 20;
    const h1Font = 'bold 24px Arial';
    const h2Font = 'bold 18px Arial';
    const urlFont = '14px Arial';
    const emojiFont = '48px serif';
    const h1LineHeight = 32;
    const h2LineHeight = 26;
    const urlLineHeight = 22;
    const extraTitlePadding = 18;
    const extraSubtitlePadding = 18;
    const extraUrlPadding = 10;
    let canvasHeight = size + padding * 2;
    let aboveLines = above ? above.split('\n').length : 0;
    let belowLines = below ? below.split('\n').length : 0;
    let urlLines = includeUrl && url ? url.split('\n').length : 0;
    if (above) canvasHeight += h1LineHeight * aboveLines + extraTitlePadding;
    if (below) canvasHeight += h2LineHeight * belowLines + extraSubtitlePadding;
    if (includeUrl && url) canvasHeight += urlLineHeight * urlLines + extraUrlPadding;
    // High-DPI support
    const dpr = 4;
    const canvas = document.createElement('canvas');
    canvas.width = (size + padding * 2) * dpr;
    canvas.height = canvasHeight * dpr;
    canvas.style.width = (size + padding * 2) + 'px';
    canvas.style.height = canvasHeight + 'px';
    const ctx = canvas.getContext('2d');
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width / dpr, canvas.height / dpr);
    ctx.textAlign = 'center';
    let y = padding;
    // Draw above text as h1
    if (above) {
      ctx.font = h1Font;
      ctx.fillStyle = '#222';
      above.split('\n').forEach(line => {
        ctx.fillText(line, (size + padding * 2) / 2, y + h1LineHeight - 8);
        y += h1LineHeight;
      });
      y += extraTitlePadding;
    }
    // Draw QR code
    const img = qrcodeContainer.querySelector('img') || qrcodeContainer.querySelector('canvas');
    if (img) {
      let qrImg = img;
      if (img.tagName.toLowerCase() === 'canvas') {
        qrImg = new window.Image();
        qrImg.src = img.toDataURL('image/png');
      }
      ctx.drawImage(qrImg, padding, y, size, size);
      // Draw emoji in center if selected
      if (emoji) {
        ctx.font = emojiFont;
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.beginPath();
        ctx.arc((size + padding * 2) / 2, y + size / 2, size * 0.18, 0, 2 * Math.PI);
        ctx.clip();
        ctx.fillText(emoji, (size + padding * 2) / 2, y + size / 2 + 2);
        ctx.restore();
      }
    }
    y += size;
    // Draw below text as h2
    if (below) {
      y += extraSubtitlePadding;
      ctx.font = h2Font;
      ctx.fillStyle = '#222';
      below.split('\n').forEach(line => {
        ctx.fillText(line, (size + padding * 2) / 2, y + h2LineHeight - 8);
        y += h2LineHeight;
      });
    }
    // Draw URL if included
    if (includeUrl && url) {
      y += extraUrlPadding;
      ctx.font = urlFont;
      ctx.fillStyle = '#444';
      ctx.fillText(url, (size + padding * 2) / 2, y + urlLineHeight - 8);
      y += urlLineHeight;
    }
    return canvas.toDataURL('image/png');
  }

  function showOverlayWhenReady() {
    setTimeout(() => {
      const dataUrl = generateImageDataUrl();
      if (dataUrl) {
        overlayImg.src = dataUrl;
        imageOverlay.style.display = '';
        document.body.style.overflow = 'hidden';
      }
    }, 1500);
  }

  urlInput.addEventListener('input', updateAll);
  textAbove.addEventListener('input', updateAll);
  textBelow.addEventListener('input', updateAll);
  includeUrlCheckbox.addEventListener('change', updateAll);

  downloadBtn.disabled = true; // Initial state

  downloadBtn.addEventListener('click', function() {
    if (downloadBtn.disabled) return;
    const url = urlInput.value.trim();
    if (!url) return;
    const above = getCleanText(textAbove);
    const below = getCleanText(textBelow);
    const includeUrl = includeUrlCheckbox.checked;
    const size = 256;
    const padding = 20;
    const h1Font = 'bold 24px Arial';
    const h2Font = 'bold 18px Arial';
    const urlFont = '14px Arial';
    const h1LineHeight = 32;
    const h2LineHeight = 26;
    const urlLineHeight = 22;
    const extraTitlePadding = 18;
    const extraSubtitlePadding = 18;
    const extraUrlPadding = 10;
    let canvasHeight = size + padding * 2;
    let aboveLines = above ? above.split('\n').length : 0;
    let belowLines = below ? below.split('\n').length : 0;
    let urlLines = includeUrl && url ? url.split('\n').length : 0;
    if (above) canvasHeight += h1LineHeight * aboveLines + extraTitlePadding;
    if (below) canvasHeight += h2LineHeight * belowLines + extraSubtitlePadding;
    if (includeUrl && url) canvasHeight += urlLineHeight * urlLines + extraUrlPadding;
    const canvas = document.createElement('canvas');
    canvas.width = size + padding * 2;
    canvas.height = canvasHeight;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = '#fff';
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.textAlign = 'center';
    let y = padding;
    // Draw above text as h1
    if (above) {
      ctx.font = h1Font;
      ctx.fillStyle = '#222';
      above.split('\n').forEach(line => {
        ctx.fillText(line, canvas.width / 2, y + h1LineHeight - 8);
        y += h1LineHeight;
      });
      y += extraTitlePadding;
    }
    // Draw QR code
    const img = qrcodeContainer.querySelector('img') || qrcodeContainer.querySelector('canvas');
    if (img) {
      let qrImg = img;
      if (img.tagName.toLowerCase() === 'canvas') {
        qrImg = new window.Image();
        qrImg.src = img.toDataURL('image/png');
      }
      ctx.drawImage(qrImg, padding, y, size, size);
      // Draw emoji in center if selected
      if (selectedEmoji) {
        ctx.font = '48px serif';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.save();
        ctx.beginPath();
        ctx.arc(canvas.width / 2, y + size / 2, size * 0.18, 0, 2 * Math.PI);
        ctx.clip();
        ctx.fillText(selectedEmoji, canvas.width / 2, y + size / 2 + 2);
        ctx.restore();
      }
    }
    y += size;
    // Draw below text as h2
    if (below) {
      y += extraSubtitlePadding;
      ctx.font = h2Font;
      ctx.fillStyle = '#222';
      below.split('\n').forEach(line => {
        ctx.fillText(line, canvas.width / 2, y + h2LineHeight - 8);
        y += h2LineHeight;
      });
    }
    // Draw URL if included
    if (includeUrl && url) {
      y += extraUrlPadding;
      ctx.font = urlFont;
      ctx.fillStyle = '#444';
      ctx.fillText(url, canvas.width / 2, y + urlLineHeight - 8);
      y += urlLineHeight;
    }
    const a = document.createElement('a');
    a.href = canvas.toDataURL('image/png');
    a.download = 'qrcode.png';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  });

  if (copyLinkBtn) {
    copyLinkBtn.addEventListener('click', function() {
      navigator.clipboard.writeText(window.location.href).then(() => {
        copyLinkBtn.textContent = 'Copied!';
        setTimeout(() => {
          copyLinkBtn.textContent = 'Copy Link';
        }, 1200);
      });
    });
  }

  if (clearBtn) {
    clearBtn.addEventListener('click', function() {
      // Push current state to history so user can go back
      window.history.pushState({}, '', window.location.href);
      urlInput.value = '';
      textAbove.textContent = '';
      textBelow.textContent = '';
      includeUrlCheckbox.checked = false;
      selectedEmoji = '';
      // Remove highlight from all emoji buttons
      if (emojiPicker) {
        Array.from(emojiPicker.querySelectorAll('.emoji-btn')).forEach(btn => btn.classList.remove('selected'));
      }
      window.history.replaceState({}, '', window.location.pathname);
      updateAll();
      updateEmojiOverlay();
    });
  }

  if (displayToggle) {
    displayToggle.addEventListener('change', function() {
      if (displayToggle.checked) {
        const dataUrl = generateImageDataUrl();
        if (dataUrl) {
          overlayImg.src = dataUrl;
          imageOverlay.style.display = '';
          document.body.style.overflow = 'hidden';
          updateUrlParams();
        } else {
          displayToggle.checked = false;
        }
      } else {
        imageOverlay.style.display = 'none';
        document.body.style.overflow = '';
        updateUrlParams();
      }
    });
  }
  if (closeOverlayBtn) {
    closeOverlayBtn.addEventListener('click', function() {
      imageOverlay.style.display = 'none';
      document.body.style.overflow = '';
      displayToggle.checked = false;
      updateUrlParams();
    });
  }

  function updateEmojiOverlay() {
    if (emojiOverlay) {
      emojiOverlay.textContent = selectedEmoji || '';
      emojiOverlay.style.display = selectedEmoji ? 'flex' : 'none';
    }
  }

  // On load, populate from URL if present
  loadFromUrlParams();
  updateAll();
  updateEmojiOverlay();
  // If display is not checked, hide overlay (otherwise overlay will be shown by generateQRCode)
  if (!(displayToggle && displayToggle.checked)) {
    imageOverlay.style.display = 'none';
    document.body.style.overflow = '';
  }

  // ESC key closes overlay
  document.addEventListener('keydown', function(e) {
    if (imageOverlay.style.display !== 'none' && (e.key === 'Escape' || e.key === 'Esc')) {
      imageOverlay.style.display = 'none';
      document.body.style.overflow = '';
      displayToggle.checked = false;
      updateUrlParams();
    }
  });

  window.addEventListener('popstate', function() {
    loadFromUrlParams();
    updateAll();
    updateEmojiOverlay();
    // If display is checked, show overlay; otherwise, hide overlay
    if (displayToggle && displayToggle.checked) {
      setTimeout(() => {
        const dataUrl = generateImageDataUrl();
        if (dataUrl) {
          overlayImg.src = dataUrl;
          imageOverlay.style.display = '';
          document.body.style.overflow = 'hidden';
        }
      }, 200);
    } else {
      imageOverlay.style.display = 'none';
      document.body.style.overflow = '';
    }
  });
}); 