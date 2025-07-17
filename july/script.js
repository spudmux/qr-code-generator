document.addEventListener('DOMContentLoaded', function() {
  const urlInput = document.getElementById('url-input');
  const qrcodeContainer = document.getElementById('qrcode');
  const downloadBtn = document.getElementById('download-btn');
  let qr;

  function clearQRCode() {
    qrcodeContainer.innerHTML = '';
    downloadBtn.style.display = 'none';
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
      downloadBtn.style.display = 'inline-block';
    }, 200); // Wait for QR to render
  }

  urlInput.addEventListener('input', function() {
    const url = urlInput.value.trim();
    generateQRCode(url);
  });

  downloadBtn.addEventListener('click', function() {
    const img = qrcodeContainer.querySelector('img') || qrcodeContainer.querySelector('canvas');
    if (img) {
      let dataUrl;
      if (img.tagName.toLowerCase() === 'img') {
        dataUrl = img.src;
      } else {
        dataUrl = img.toDataURL('image/png');
      }
      const a = document.createElement('a');
      a.href = dataUrl;
      a.download = 'qrcode.png';
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    }
  });

  // Optionally, generate QR code if input is pre-filled
  if (urlInput.value.trim()) {
    generateQRCode(urlInput.value.trim());
  }
}); 