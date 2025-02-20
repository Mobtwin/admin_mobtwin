import sharp from "sharp";

// Utility function to process images
export async function processImage(fileBuffer:Buffer) {
    try {
      // Convert and compress the image to WebP format
      return await sharp(fileBuffer)
        .webp({ quality: 80 })
        .toBuffer();
    } catch (sharpError:any) {
      console.error('Error processing image with sharp:', sharpError.message);
      throw new Error(`Unsupported image format or corrupted file.`);
    }
  }