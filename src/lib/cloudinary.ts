import { v2 as cloudinary } from "cloudinary";

// Configure once — credentials come from server-only env vars.
// These are never exposed to the browser.
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
  secure: true,
});

export interface UploadResult {
  url: string;
  publicId: string;
}

/**
 * Upload a file buffer to Cloudinary.
 *
 * @param buffer  Raw file data (obtained from `await file.arrayBuffer()`)
 * @param folder  Cloudinary folder name (e.g. "far/logos", "far/photos")
 */
export async function uploadImage(
  buffer: Buffer,
  folder: string
): Promise<UploadResult> {
  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder,
        resource_type: "image",
        transformation: [
          // Auto-format (WebP on supported browsers) and quality optimisation
          { fetch_format: "auto", quality: "auto" },
        ],
      },
      (error, result) => {
        if (error || !result) {
          return reject(error ?? new Error("Cloudinary upload failed"));
        }
        resolve({ url: result.secure_url, publicId: result.public_id });
      }
    );

    uploadStream.end(buffer);
  });
}

/**
 * Delete an asset from Cloudinary by its public_id.
 * Safe to call with an empty / undefined publicId — does nothing in that case.
 */
export async function deleteImage(publicId: string | undefined | null): Promise<void> {
  if (!publicId) return;
  await cloudinary.uploader.destroy(publicId);
}
