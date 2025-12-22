import imageCompression from 'browser-image-compression';

export interface CompressionOptions {
    maxSizeMB?: number;
    maxWidthOrHeight?: number;
    useWebWorker?: boolean;
    quality?: number;
}

const DEFAULT_OPTIONS: CompressionOptions = {
    maxSizeMB: 0.5, // 500KB
    maxWidthOrHeight: 1200,
    useWebWorker: true,
    quality: 0.8,
};

/**
 * Compress a single image file
 * - Images > 1MB are compressed aggressively
 * - Images < 100KB are not compressed
 * - Maintains visual quality while reducing file size
 */
export async function compressImage(
    file: File,
    options: CompressionOptions = {}
): Promise<File> {
    // Skip compression for small files (< 100KB)
    if (file.size < 100 * 1024) {
        return file;
    }

    const mergedOptions = { ...DEFAULT_OPTIONS, ...options };

    // More aggressive compression for very large files (> 1MB)
    if (file.size > 1024 * 1024) {
        mergedOptions.maxSizeMB = 0.3;
        mergedOptions.quality = 0.7;
    }

    try {
        const compressedFile = await imageCompression(file, {
            maxSizeMB: mergedOptions.maxSizeMB,
            maxWidthOrHeight: mergedOptions.maxWidthOrHeight,
            useWebWorker: mergedOptions.useWebWorker,
            initialQuality: mergedOptions.quality,
            fileType: "image/webp"
        });

        console.log(
            `Compressed ${file.name}: ${(file.size / 1024).toFixed(1)}KB → ${(compressedFile.size / 1024).toFixed(1)}KB (WebP)`
        );

        // Ensure the file has the correct extension for upload
        const newFileName = file.name.replace(/\.[^/.]+$/, "") + ".webp";
        return new File([compressedFile], newFileName, { type: "image/webp" });
    } catch (error) {
        console.error('Image compression failed:', error);
        return file; // Return original on error
    }
}

/**
 * Compress multiple image files in parallel
 */
export async function compressMultipleImages(
    files: File[],
    options: CompressionOptions = {}
): Promise<File[]> {
    const compressionPromises = files.map((file) => compressImage(file, options));
    return Promise.all(compressionPromises);
}

/**
 * Generate a unique filename for upload
 */
export function generateImageFilename(originalName: string, index: number): string {
    const ext = originalName.split('.').pop() || 'jpg';
    const timestamp = Date.now();
    const prefix = index === 0 ? 'cover' : `gallery_${index}`;
    return `${prefix}_${timestamp}.${ext}`;
}

/**
 * Check if file is a valid image
 */
export function isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
    return validTypes.includes(file.type);
}

/**
 * Create object URL for image preview
 */
export function createImagePreview(file: File): string {
    return URL.createObjectURL(file);
}

/**
 * Revoke object URL to free memory
 */
export function revokeImagePreview(url: string): void {
    URL.revokeObjectURL(url);
}

/**
 * Generate a tiny, blurred base64 string for an image (LQIP)
 * Creates a 10px wide version of the image to use as a blur placeholder
 */
export async function generateBlurDataUrl(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
        const img = new Image();
        const url = URL.createObjectURL(file);

        img.onload = () => {
            URL.revokeObjectURL(url);

            // Calculate dimensions (max 10px width/height)
            const maxDim = 10;
            let width = img.width;
            let height = img.height;

            if (width > height) {
                if (width > maxDim) {
                    height = Math.round((height * maxDim) / width);
                    width = maxDim;
                }
            } else {
                if (height > maxDim) {
                    width = Math.round((width * maxDim) / height);
                    height = maxDim;
                }
            }

            const canvas = document.createElement('canvas');
            canvas.width = width;
            canvas.height = height;

            const ctx = canvas.getContext('2d');
            if (!ctx) {
                reject(new Error('Could not get canvas context'));
                return;
            }

            // Draw tiny image
            ctx.drawImage(img, 0, 0, width, height);

            // Export as base64
            resolve(canvas.toDataURL('image/jpeg', 0.5)); // Low quality is fine for blur
        };

        img.onerror = () => {
            URL.revokeObjectURL(url);
            reject(new Error('Failed to load image for blur generation'));
        };

        img.src = url;
    });
}
