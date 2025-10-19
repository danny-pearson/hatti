/**
 * Options for loading images.
 */
export interface ImageLoadOptions {
    /**
     * Use ImageBitmap instead of HTMLImageElement (faster for canvas rendering).
     */
    useBitmap?: boolean;

    /**
     * ImageBitmap creation options (only used when useBitmap is true).
     */
    bitmapOptions?: ImageBitmapOptions;

    /**
     * Optional callback invoked after each image loads or fails.
     */
    onProgress?: (loaded: number, total: number, key: string, success: boolean) => void;
}

/**
 * Metadata for a loaded image resource.
 */
export interface ImageMetadata {
    /**
     * The resource key.
     */
    key: string;

    /**
     * The original URL or data URI.
     */
    url: string;

    /**
     * Image width in pixels.
     */
    width: number;

    /**
     * Image height in pixels.
     */
    height: number;

    /**
     * Timestamp when the image was loaded (milliseconds since epoch).
     */
    loadedAt: number;

    /**
     * Whether this is an ImageBitmap (true) or HTMLImageElement (false).
     */
    isBitmap: boolean;
}

/**
 * Result of a single image load operation.
 */
export interface ImageLoadResult {
    /**
     * The resource key.
     */
    key: string;

    /**
     * Whether the load succeeded.
     */
    success: boolean;

    /**
     * Error message if load failed.
     */
    error?: string;
}

/**
 * Stored image resource (either HTMLImageElement or ImageBitmap).
 */
interface StoredImage {
    resource: HTMLImageElement | ImageBitmap;
    metadata: ImageMetadata;
}

/**
 * Validates that a string is a valid URL or data URI.
 *
 * @param   url - The string to validate
 * @returns     True if valid URL or data URI
 */
const isValidURL = (url: string): boolean => {
    if (url.startsWith('data:')) return true;

    try {
        new URL(url);
        return true;
    } catch {
        return false;
    }
};

/**
 * Static class for loading and caching image resources.
 *
 * Supports both HTMLImageElement and ImageBitmap loading, with batch operations,
 * progress tracking, and resource management.
 */
class ImageLoader {
    static #loadedImages: Map<string, StoredImage> = new Map();

    /**
     * Loads multiple images from URLs or data URIs.
     *
     * Uses Promise.allSettled to ensure one failure doesn't prevent other images from loading.
     * Returns detailed results for each load operation.
     *
     * @param   keySrcPairs - Object mapping keys to image URLs
     * @param   options     - Optional loading configuration
     * @returns               Array of load results for each image
     */
    public static async load(
        keySrcPairs: Record<string, string>,
        options?:    ImageLoadOptions,
    ): Promise<ImageLoadResult[]> {
        const entries = Object.entries(keySrcPairs);
        const total = entries.length;

        let completed = 0;

        const results = await Promise.allSettled(
            entries.map(async ([key, url]) => {
                if (ImageLoader.#loadedImages.has(key)) {
                    console.warn(`[ImageLoader::load]: Key '${key}' already loaded, skipping`);

                    completed++;
                    options?.onProgress?.(completed, total, key, true);

                    return { key, success: true };
                }

                if (!isValidURL(url)) {
                    throw new Error(`[ImageLoader::load]: Invalid URL: ${url}`);
                }

                if (options?.useBitmap) {
                    await ImageLoader.#loadAsBitmap(key, url, options.bitmapOptions);
                } else {
                    await ImageLoader.#loadAsImage(key, url);
                }

                completed++;
                options?.onProgress?.(completed, total, key, true);

                return { key, success: true };
            }),
        );

        return results.map((result, index) => {
            const key = entries[index]![0];

            if (result.status === 'fulfilled') return result.value;

            const error = result.reason instanceof Error
                ? result.reason.message
                : String(result.reason);

            console.error(`[ImageLoader::load]: Failed to load '${key}': ${error}`);

            options?.onProgress?.(completed, total, key, false);

            return {
                key,
                success: false,
                error,
            };
        });
    }

    /**
     * Loads a single image from a URL or data URI.
     *
     * @param   key     - Unique key to store the image under
     * @param   url     - Image URL or data URI
     * @param   options - Optional loading configuration
     * @returns           True if load succeeded, false otherwise
     */
    public static async loadOne(
        key:      string,
        url:      string,
        options?: ImageLoadOptions,
    ): Promise<boolean> {
        const results = await ImageLoader.load({ [key]: url }, options);

        return results[0]?.success ?? false;
    }

    /**
     * Retrieves a loaded image resource by key.
     *
     * @param   key - The resource key
     * @returns       The loaded HTMLImageElement or ImageBitmap
     */
    public static get(key: string): HTMLImageElement | ImageBitmap {
        const stored = ImageLoader.#loadedImages.get(key);

        if (!stored) {
            throw new ReferenceError(`[ImageLoader::get]: No image indexed by key '${key}'`);
        }

        return stored.resource;
    }

    /**
     * Retrieves metadata for a loaded image resource.
     *
     * @param   key - The resource key
     * @returns       Metadata for the image, or undefined if not found
     */
    public static getMetadata(key: string): ImageMetadata | undefined {
        return ImageLoader.#loadedImages.get(key)?.metadata;
    }

    /**
     * Checks if an image is loaded under the given key.
     *
     * @param   key - The resource key to check
     * @returns       True if the key exists in the cache
     */
    public static has(key: string): boolean {
        return ImageLoader.#loadedImages.has(key);
    }

    /**
     * Unloads a specific image resource and frees its memory.
     *
     * @param key - The resource key to unload
     */
    public static unload(key: string): void {
        const stored = ImageLoader.#loadedImages.get(key);

        if (stored) {
            if (stored.metadata.isBitmap) {
                (stored.resource as ImageBitmap).close();
            }

            ImageLoader.#loadedImages.delete(key);
        }
    }

    /**
     * Unloads multiple image resources.
     *
     * @param keys - Array of resource keys to unload
     */
    public static unloadMany(keys: string[]): void {
        for (const key of keys) {
            ImageLoader.unload(key);
        }
    }

    /**
     * Clears all loaded images and frees their memory.
     */
    public static clear(): void {
        for (const [key] of ImageLoader.#loadedImages) {
            ImageLoader.unload(key);
        }

        ImageLoader.#loadedImages.clear();
    }

    /**
     * Gets all loaded image keys.
     *
     * @returns Array of all resource keys currently loaded
     */
    public static keys(): string[] {
        return [...ImageLoader.#loadedImages.keys()];
    }

    /**
     * Gets the total number of loaded images.
     *
     * @returns Number of images currently in cache
     */
    public static size(): number {
        return ImageLoader.#loadedImages.size;
    }

    /**
     * Loads an image as HTMLImageElement (internal method).
     */
    static async #loadAsImage(key: string, url: string): Promise<void> {
        return new Promise((resolve, reject) => {
            const image = new Image();

            image.addEventListener('load', () => {
                ImageLoader.#loadedImages.set(key, {
                    resource: image,
                    metadata: {
                        key,
                        url,
                        width: image.naturalWidth,
                        height: image.naturalHeight,
                        loadedAt: Date.now(),
                        isBitmap: false,
                    },
                });
                resolve();
            }, { once: true });

            image.addEventListener('error', () => {
                reject(new Error(`Failed to load image`));
            }, { once: true });

            image.crossOrigin = 'anonymous';
            image.src = url;
        });
    }

    /**
     * Loads an image as ImageBitmap (internal method).
     */
    static async #loadAsBitmap(
        key:            string,
        url:            string,
        bitmapOptions?: ImageBitmapOptions,
    ): Promise<void> {
        const response = await fetch(url);

        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const blob = await response.blob();
        const bitmap = await createImageBitmap(blob, bitmapOptions);

        ImageLoader.#loadedImages.set(key, {
            resource: bitmap,
            metadata: {
                key,
                url,
                width: bitmap.width,
                height: bitmap.height,
                loadedAt: Date.now(),
                isBitmap: true,
            },
        });
    }
}

export default ImageLoader;
