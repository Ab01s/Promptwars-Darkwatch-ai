export interface CompressionResult {
  dataUrl: string;
  originalWidth: number;
  originalHeight: number;
  compressedWidth: number;
  compressedHeight: number;
  originalSizeKb: number;
  compressedSizeKb: number;
  reductionPercentage: number;
}

/**
 * Client-side canvas step to automatically downscale and compress large screenshots
 * before transmitting to the backend, ensuring sub-second uploads and zero timeouts.
 */
export async function compressScreenshot(
  dataUrl: string,
  maxDimension: number = 1400,
  quality: number = 0.85
): Promise<CompressionResult> {
  // If it's an SVG data URL, SVG is vector and doesn't need downscaling
  if (dataUrl.startsWith('data:image/svg+xml')) {
    const rawLen = dataUrl.length;
    const sizeKb = Math.round((rawLen * 0.75) / 1024);
    return {
      dataUrl,
      originalWidth: 800,
      originalHeight: 600,
      compressedWidth: 800,
      compressedHeight: 600,
      originalSizeKb: sizeKb,
      compressedSizeKb: sizeKb,
      reductionPercentage: 0,
    };
  }

  return new Promise((resolve) => {
    const img = new Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      const origW = img.width || 800;
      const origH = img.height || 600;
      const origSizeKb = Math.round((dataUrl.length * 0.75) / 1024);

      // Determine if downscaling is needed
      let targetW = origW;
      let targetH = origH;

      if (origW > maxDimension || origH > maxDimension) {
        if (origW > origH) {
          targetW = maxDimension;
          targetH = Math.round((origH * maxDimension) / origW);
        } else {
          targetH = maxDimension;
          targetW = Math.round((origW * maxDimension) / origH);
        }
      }

      // Create off-screen canvas
      const canvas = document.createElement('canvas');
      canvas.width = targetW;
      canvas.height = targetH;
      const ctx = canvas.getContext('2d');

      if (!ctx) {
        resolve({
          dataUrl,
          originalWidth: origW,
          originalHeight: origH,
          compressedWidth: origW,
          compressedHeight: origH,
          originalSizeKb: origSizeKb,
          compressedSizeKb: origSizeKb,
          reductionPercentage: 0,
        });
        return;
      }

      // High quality smoothing
      ctx.imageSmoothingEnabled = true;
      ctx.imageSmoothingQuality = 'high';
      ctx.drawImage(img, 0, 0, targetW, targetH);

      // Export as JPEG with controlled quality
      const compressedDataUrl = canvas.toDataURL('image/jpeg', quality);
      const compSizeKb = Math.round((compressedDataUrl.length * 0.75) / 1024);
      const reduction = origSizeKb > 0 ? Math.max(0, Math.round(((origSizeKb - compSizeKb) / origSizeKb) * 100)) : 0;

      resolve({
        dataUrl: compressedDataUrl,
        originalWidth: origW,
        originalHeight: origH,
        compressedWidth: targetW,
        compressedHeight: targetH,
        originalSizeKb: origSizeKb,
        compressedSizeKb: compSizeKb,
        reductionPercentage: reduction,
      });
    };

    img.onerror = () => {
      const fallbackSizeKb = Math.round((dataUrl.length * 0.75) / 1024);
      resolve({
        dataUrl,
        originalWidth: 0,
        originalHeight: 0,
        compressedWidth: 0,
        compressedHeight: 0,
        originalSizeKb: fallbackSizeKb,
        compressedSizeKb: fallbackSizeKb,
        reductionPercentage: 0,
      });
    };

    img.src = dataUrl;
  });
}
