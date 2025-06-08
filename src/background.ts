import Tesseract from 'ocr-tesseractjs-selfcontained';

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'start-ocr') {
    (async () => {
      const { createWorker } = Tesseract;
      const worker = await createWorker({
        workerPath: chrome.runtime.getURL('tesseract.worker.js'),
        corePath: chrome.runtime.getURL('tesseract-core.wasm'),
        logger: (m) => {
          if (typeof m.progress === "number") {
            chrome.runtime.sendMessage({
              action: "ocrProgress",
              progress: m.progress
            });
          }
        }
      });

      await worker.load();
      await worker.loadLanguage('eng');
      await worker.initialize('eng');

      try {
        const { data } = await worker.recognize(msg.imageUrl);
        chrome.runtime.sendMessage({ action: 'ocrResult', words: data.words });
      } catch (err) {
        chrome.runtime.sendMessage({ action: 'ocrError', message: err.message });
      }

      await worker.terminate();
    })();

    return false;
  }
});