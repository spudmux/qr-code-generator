# URL to QR Code Generator

> **Disclaimer:** This project was vibecoded. The code was generated but not read!

A lightweight webapp to convert URLs into QR codes. No backend required—runs entirely in your browser.

## Features
- Enter a URL and generate a QR code instantly (live as you type)
- Editable heading and subtitle (click to edit above/below the QR code)
- Option to include the URL in the generated image (toggle switch)
- **Display toggle:** Show the generated image fullscreen in an overlay (state is shareable via the URL)
- Download the QR code as an image (with all text)
- Copy Link button: share your QR code and all settings via the URL
- Clear button: reset all fields (can undo with browser back)
- Overlay can be closed with the close button or Escape key
- State (including display mode) is preserved in the URL and on browser navigation
- Mobile-friendly, minimal UI

## Usage
1. Open `index.html` in your browser
2. Enter a URL, edit the heading/subtitle, and set options as desired
3. The QR code and preview update live
4. Click **Download QR Code** to save the image
5. Click **Copy Link** to share your current QR code and settings
6. Click the **×** (Clear) button in the top-right of the preview to reset all fields (use browser back to undo)
7. Toggle **Display** to show the generated image fullscreen (overlay can be closed with the close button or Escape)

## Deploying to GitHub Pages
1. Push this repository to GitHub
2. In your repo, go to **Settings > Pages**
3. Set the source branch to `main` (or `master`) and the root folder (`/`)
4. Visit `https://your-username.github.io/your-repo-name/` to use your app

---

Built with [qrcodejs](https://davidshimjs.github.io/qrcodejs/) 