function runContrastAnalysis(words) {
    const canvas = document.getElementById("originalCanvas");
    const resultCanvas = document.getElementById("resultCanvas");
    resultCanvas.width = canvas.width;
    resultCanvas.height = canvas.height;

    const ctx = canvas.getContext("2d");
    const resultCtx = resultCanvas.getContext("2d");
    const originalData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const resultImage = resultCtx.createImageData(canvas.width, canvas.height);

    for (let i = 0; i < originalData.data.length; i += 4) {
        resultImage.data[i + 0] = 128;
        resultImage.data[i + 1] = 128;
        resultImage.data[i + 2] = 128;
        resultImage.data[i + 3] = 255;
    }

    const isLargeText = document.getElementById("largeText")?.checked;

    for (const word of words) {
        const { x0, y0, x1, y1 } = word.bbox;
        for (let y = y0; y < y1; y++) {
            for (let x = x0; x < x1; x++) {
                const idx = (y * canvas.width + x) * 4;
                const fg = [
                    originalData.data[idx],
                    originalData.data[idx + 1],
                    originalData.data[idx + 2]
                ];

                let bg = [255, 255, 255];
                const bgIdx = ((y + 1) * canvas.width + x + 1) * 4;
                if (bgIdx < originalData.data.length) {
                    bg = [
                        originalData.data[bgIdx],
                        originalData.data[bgIdx + 1],
                        originalData.data[bgIdx + 2]
                    ];
                }

                const pass = passesContrast(fg, bg, isLargeText);
                const color = pass ? [0, 200, 0] : [200, 0, 0];
                resultImage.data[idx + 0] = color[0];
                resultImage.data[idx + 1] = color[1];
                resultImage.data[idx + 2] = color[2];
                resultImage.data[idx + 3] = 255;
            }
        }
    }

    resultCtx.putImageData(resultImage, 0, 0);
    document.getElementById("progressBar").style.display = "none";
    document.getElementById("analyzeBtn").disabled = false;
    document.getElementById("status").textContent = `✅ Analysis complete. ${words.length} words found.`;
}

document.getElementById("enablePicker").addEventListener("click", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, tabs => {
        if (tabs[0]?.id) {
            chrome.tabs.executeScript(tabs[0].id, { file: "content.js" });
            chrome.tabs.sendMessage(tabs[0].id, { action: "start-element-picker" });
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

function check() {
    (async () => {
        const workerBlob = await fetch(chrome.runtime.getURL("tesseract.worker.js")).then(r => r.blob());
        const workerwasmBlob = await fetch(chrome.runtime.getURL("tesseract-core.wasm")).then(r => r.blob());
        const workerUrl = URL.createObjectURL(workerBlob);

        const worker = await Tesseract.createWorker({
            workerPath: workerUrl,
            corePath: workerwasmBlob,
            logger: (m) => {
                if (typeof m.progress === "number") {
                    document.getElementById("progressFill").style.width = `${Math.round(m.progress * 100)}%`;
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
}

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
                check()
            });
        };

        img.onerror = () => {
            document.getElementById("status").textContent = "❌ Could not load image. Possibly blocked by CORS.";
        };
    });
});