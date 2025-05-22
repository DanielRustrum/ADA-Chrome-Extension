chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'start-ocr') {
    chrome.storage.local.set({ pendingImageUrl: msg.imageUrl });

    chrome.offscreen.hasDocument().then((has) => {
      if (!has) {
        chrome.offscreen.createDocument({
          url: 'offscreen.html',
          reasons: [chrome.offscreen.Reason.WORKERS],
          justification: 'Run OCR using WebAssembly in an offscreen context'
        }).then(() => {
          chrome.runtime.sendMessage({ action: 'ping' });
        }).catch(err => {
          console.error("❌ Failed to create offscreen document:", err);
        });
      } else {
        chrome.runtime.sendMessage({ action: 'ocr-image', imageUrl: msg.imageUrl });
      }
    });
  }

  if (msg.action === 'offscreen-ready') {
    chrome.storage.local.get("pendingImageUrl", ({ pendingImageUrl }) => {
      if (pendingImageUrl) {
        chrome.runtime.sendMessage({ action: 'ocr-image', imageUrl: pendingImageUrl });
        chrome.storage.local.remove("pendingImageUrl");
      }
    });
  }
});