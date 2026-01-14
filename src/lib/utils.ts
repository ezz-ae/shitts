import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * FIREBASE IMAGE RESIZING HELPER
 * Optimized for the "Resize Images" Firebase Extension.
 * Use this to fetch smaller, high-performance versions of your images.
 */
export function getResizedImageUrl(url: string, size: '200x200' | '400x400' | '600x600' = '400x400') {
  if (!url || !url.includes('firebasestorage.googleapis.com')) return url;
  
  // Videos don't get resized by this specific extension
  if (url.toLowerCase().endsWith('.mp4') || url.toLowerCase().includes('.mov')) return url;

  try {
    const urlParts = url.split('?');
    const baseUrl = urlParts[0];
    const queryParams = urlParts[1] ? `?${urlParts[1]}` : '';

    // Extension convention: adds _size before the extension
    // Example: image.png -> image_400x400.png
    const lastDotIndex = baseUrl.lastIndexOf('.');
    if (lastDotIndex === -1) return url;

    const name = baseUrl.substring(0, lastDotIndex);
    const ext = baseUrl.substring(lastDotIndex);
    
    // Note: In production, resized images might not share the same token.
    // If the bucket is public, we can strip the token. 
    // If private, the extension needs to be configured to handle tokens or we use public URLs.
    return `${name}_${size}${ext}${queryParams}`;
  } catch (e) {
    return url;
  }
}
