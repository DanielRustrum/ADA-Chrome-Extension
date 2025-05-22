document.getElementById("enablePicker").addEventListener("click", () => {
  chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
    if (tabs[0]?.id) {
      chrome.scripting.executeScript({
        target: { tabId: tabs[0].id },
        files: ["content.js"]
      }, () => {
        if (chrome.runtime.lastError) {
          alert("Could not start image picker. Please refresh the page and try again.");
        } else {
          chrome.tabs.sendMessage(tabs[0].id, { action: "start-element-picker" });
        }
      });
    }
  });
});

chrome.runtime.onMessage.addListener((msg) => {
  console.log(msg)
  if (msg.action === 'ocrProgress') {
    const percent = Math.round(msg.progress * 100);
    document.getElementById("progressFill").style.width = `${percent}%`;
  }

  if (msg.action === 'ocrResult') {
    runContrastAnalysis(msg.words);
  }

  if (msg.action === 'ocrError') {
    document.getElementById("status").textContent = `❌ OCR failed: ${msg.message}`;
  }
});

window.addEventListener("DOMContentLoaded", () => {
  const analyzeBtn = document.getElementById("analyzeBtn");
  const progressBar = document.getElementById("progressBar");
  const progressFill = document.getElementById("progressFill");

  chrome.storage.local.get("lastImageSrc", ({ lastImageSrc }) => {
    if (!lastImageSrc) return;

    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.src = lastImageSrc;

    img.onload = () => {
      const canvas = document.getElementById("originalCanvas");
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext("2d");
      ctx.drawImage(img, 0, 0);

      analyzeBtn.addEventListener("click", () => {
        analyzeBtn.disabled = true;
        progressBar.style.display = "block";
        progressFill.style.width = "0%";
        chrome.runtime.sendMessage({ action: 'start-ocr', imageUrl: img.src });
      });
    };

    img.onerror = () => {
      document.getElementById("status").textContent = "❌ Could not load image. Possibly blocked by CORS.";
    };
  });
});
