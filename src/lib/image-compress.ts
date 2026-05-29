const MAX_WIDTH = 1200;
const QUALITY = 0.8;

export function compressImage(file: File): Promise<File> {
  return new Promise((resolve, reject) => {
    if (!file.type.startsWith("image/")) {
      reject(new Error("Not an image"));
      return;
    }

    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;
      if (width > MAX_WIDTH) {
        height = Math.round((height / width) * MAX_WIDTH);
        width = MAX_WIDTH;
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d")!;
      ctx.drawImage(img, 0, 0, width, height);

      const outputType = file.type === "image/png" ? "image/png" : "image/webp";
      canvas.toBlob(
        (blob) => {
          if (!blob) {
            reject(new Error("Compression failed"));
            return;
          }
          const ext = outputType === "image/png" ? "png" : "webp";
          const compressed = new File([blob], file.name.replace(/\.[^.]+$/, `.${ext}`), {
            type: outputType,
          });
          resolve(compressed);
        },
        outputType,
        QUALITY,
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      reject(new Error("Failed to load image"));
    };

    img.src = url;
  });
}
