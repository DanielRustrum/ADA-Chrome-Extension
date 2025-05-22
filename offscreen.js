console.log("✅ offscreen.js loaded");

chrome.runtime.onMessage.addListener(async (msg) => {
    if (msg.action === 'ping') {
        chrome.runtime.sendMessage({ action: 'offscreen-ready' });
        return;
    }

    if (msg.action === 'ocr-image') {

        const worker = await Tesseract.createWorker({
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



        try {
            await worker.load();
            chrome.runtime.sendMessage({ action: 'ocr-log', message: worker });
            await worker.loadLanguage('eng');
            await worker.initialize('eng');
            const { data } = await worker.recognize(msg.imageUrl);
            chrome.runtime.sendMessage({ action: 'ocrResult', words: data.words });
        } catch (err) {
            chrome.runtime.sendMessage({ action: 'ocrError', message: err.message });
        }

        await worker.terminate();
    }
});