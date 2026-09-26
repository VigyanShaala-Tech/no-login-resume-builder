import type { Area } from "react-easy-crop";

/** Saved resume photos are a square JPEG. Templates only mask this (circle or rounded square). */
const OUTPUT_SIZE = 512;

function loadImage(src: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new Image();
    image.onload = () => resolve(image);
    image.onerror = () => reject(new Error("Could not read that image"));
    image.src = src;
  });
}

export async function cropImageToDataUrl(imageSrc: string, pixelCrop: Area): Promise<string> {
  const image = await loadImage(imageSrc);
  const x = Math.max(0, pixelCrop.x);
  const y = Math.max(0, pixelCrop.y);
  const width = Math.min(pixelCrop.width, image.naturalWidth - x);
  const height = Math.min(pixelCrop.height, image.naturalHeight - y);
  if (width < 1 || height < 1) {
    throw new Error("Crop area is empty");
  }

  const canvas = document.createElement("canvas");
  canvas.width = OUTPUT_SIZE;
  canvas.height = OUTPUT_SIZE;
  const ctx = canvas.getContext("2d");
  if (!ctx) {
    throw new Error("Could not crop photo");
  }

  ctx.fillStyle = "#ffffff";
  ctx.fillRect(0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  ctx.drawImage(image, x, y, width, height, 0, 0, OUTPUT_SIZE, OUTPUT_SIZE);
  return canvas.toDataURL("image/jpeg", 0.9);
}
