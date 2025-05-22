chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.action === 'start-element-picker') {
    const highlight = el => el.style.outline = '3px solid red';
    const unhighlight = el => el.style.outline = '';

    const onClick = e => {
      e.preventDefault();
      e.stopPropagation();
      const img = e.target.closest('img');
      if (img) {
        chrome.storage.local.set({ lastImageSrc: img.src });
        alert('Image selected! Return to popup.');
      } else {
        alert('No image found.');
      }
      document.removeEventListener('mouseover', hoverHandler);
      document.removeEventListener('click', onClick, true);
    };

    const hoverHandler = e => {
      document.querySelectorAll('img').forEach(unhighlight);
      const img = e.target.closest('img');
      if (img) highlight(img);
    };

    document.addEventListener('mouseover', hoverHandler);
    document.addEventListener('click', onClick, true);
  }
});