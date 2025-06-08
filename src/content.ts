chrome.runtime.onMessage.addListener((msg) => {
  if (msg.action === "start-element-picker") {
    document.body.addEventListener("click", (e) => {
      const img = e.target.closest("img");
      if (img) {
        e.preventDefault();
        e.stopPropagation();
        chrome.storage.local.set({ lastImageSrc: img.src }, () => {
          alert("✅ Image selected! Return to the popup to analyze.");
        });
      }
    }, { once: true });
  }
});