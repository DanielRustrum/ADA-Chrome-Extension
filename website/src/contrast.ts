//* Source: https://www.w3.org/TR/WCAG21/#dfn-relative-luminance
function luminance(r, g, b) {
    const toLinearLight = c => {
        c /= 255; // Normalize to 0-1
        return c <= 0.04045 ?
            c / 12.92 :
            Math.pow((c + 0.055) / 1.055, 2.4); // Gamma Correction Curve: https://en.wikipedia.org/wiki/Gamma_correction
    };
    return 0.2126 * toLinearLight(r) + 0.7152 * toLinearLight(g) + 0.0722 * toLinearLight(b); // Weights R:21.26%, G: 71.52%, B:7.22%
}

function contrastRatio(rgb1, rgb2) {
    const lum1 = luminance(rgb1[0], rgb1[1], rgb1[2]);
    const lum2 = luminance(rgb2[0], rgb2[1], rgb2[2]);
    const L1 = Math.max(lum1, lum2);
    const L2 = Math.min(lum1, lum2);
    return (L1 + 0.05) / (L2 + 0.05);
}

function passesContrast(fg, bg, isLargeText) {
    const ratio = contrastRatio(fg, bg);
    return ratio >= (isLargeText ? 3.0 : 4.5);
}


