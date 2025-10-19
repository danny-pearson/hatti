import {
    describe, it, expect, beforeEach, vi,
} from 'vitest';
import ImageLoader from '../dist/ImageLoader.js';

/**
 * Tests for the ImageLoader class.
 *
 * Note: These tests run in a jsdom environment to provide DOM APIs.
 * Image and createImageBitmap are mocked in setup.ts to auto-trigger load events.
 */
describe('ImageLoader', () => {
    const mockImageUrl = 'https://example.com/image.png';
    const mockImageUrl2 = 'https://example.com/image2.png';
    const dataUri = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==';

    beforeEach(() => {
        // Clear the cache before each test
        ImageLoader.clear();
    });

    describe('load()', () => {
        it('should load multiple images successfully', async () => {
            const results = await ImageLoader.load({
                img1: mockImageUrl,
                img2: mockImageUrl2,
            });

            expect(results).toHaveLength(2);
            expect(results[0]?.success).toBe(true);
            expect(results[1]?.success).toBe(true);
            expect(ImageLoader.size()).toBe(2);
        });

        it('should skip loading if key is already cached', async () => {
            // Load first time
            await ImageLoader.load({ img1: mockImageUrl });

            const warnSpy = vi.spyOn(console, 'warn').mockImplementation(() => {});

            // Try to load again with same key
            const results = await ImageLoader.load({ img1: mockImageUrl });

            expect(results[0]?.success).toBe(true);
            expect(warnSpy).toHaveBeenCalledWith(
                expect.stringContaining('[ImageLoader::load]: Key \'img1\' already loaded'),
            );
            expect(ImageLoader.size()).toBe(1);

            warnSpy.mockRestore();
        });

        it('should validate URLs and reject invalid ones', async () => {
            const results = await ImageLoader.load({
                invalid: 'not a valid url',
            });

            expect(results[0]?.success).toBe(false);
            expect(results[0]?.error).toContain('Invalid URL');
        });

        it('should accept data URIs as valid URLs', async () => {
            const results = await ImageLoader.load({ img1: dataUri });

            expect(results[0]?.success).toBe(true);
        });

        it('should call progress callback for each image', async () => {
            const progressCallback = vi.fn();

            await ImageLoader.load(
                {
                    img1: mockImageUrl,
                    img2: mockImageUrl2,
                },
                { onProgress: progressCallback },
            );

            expect(progressCallback).toHaveBeenCalledTimes(2);
            expect(progressCallback).toHaveBeenCalledWith(1, 2, 'img1', true);
            expect(progressCallback).toHaveBeenCalledWith(2, 2, 'img2', true);
        });

        it('should load images as ImageBitmap when useBitmap option is true', async () => {
            const results = await ImageLoader.load(
                { img1: mockImageUrl },
                { useBitmap: true },
            );

            expect(results[0]?.success).toBe(true);
            expect(ImageLoader.size()).toBe(1);

            const metadata = ImageLoader.getMetadata('img1');
            expect(metadata?.isBitmap).toBe(true);
        });

        it('should pass bitmapOptions to createImageBitmap', async () => {
            const createImageBitmapSpy = vi.spyOn(global, 'createImageBitmap');

            const bitmapOptions: ImageBitmapOptions = {
                premultiplyAlpha: 'none',
                colorSpaceConversion: 'none',
            };

            await ImageLoader.load(
                { img1: mockImageUrl },
                {
                    useBitmap: true,
                    bitmapOptions,
                },
            );

            expect(createImageBitmapSpy).toHaveBeenCalledWith(
                expect.any(Blob),
                bitmapOptions,
            );

            createImageBitmapSpy.mockRestore();
        });
    });

    describe('loadOne()', () => {
        it('should load a single image and return true on success', async () => {
            const result = await ImageLoader.loadOne('img1', mockImageUrl);

            expect(result).toBe(true);
            expect(ImageLoader.has('img1')).toBe(true);
        });

        it('should return false on failure', async () => {
            const result = await ImageLoader.loadOne('img1', 'invalid url');

            expect(result).toBe(false);
            expect(ImageLoader.has('img1')).toBe(false);
        });
    });

    describe('get()', () => {
        it('should retrieve a loaded image', async () => {
            await ImageLoader.load({ img1: mockImageUrl });

            const image = ImageLoader.get('img1');

            expect(image).toBeDefined();
        });

        it('should throw ReferenceError if key does not exist', () => {
            expect(() => ImageLoader.get('nonexistent')).toThrow(ReferenceError);
            expect(() => ImageLoader.get('nonexistent')).toThrow('[ImageLoader::get]');
        });
    });

    describe('getMetadata()', () => {
        it('should return metadata for a loaded image', async () => {
            await ImageLoader.load({ img1: mockImageUrl });

            const metadata = ImageLoader.getMetadata('img1');

            expect(metadata).toBeDefined();
            expect(metadata?.key).toBe('img1');
            expect(metadata?.url).toBe(mockImageUrl);
            expect(metadata?.width).toBe(100);
            expect(metadata?.height).toBe(100);
            expect(metadata?.isBitmap).toBe(false);
            expect(metadata?.loadedAt).toBeTypeOf('number');
        });

        it('should return undefined if key does not exist', () => {
            const metadata = ImageLoader.getMetadata('nonexistent');
            expect(metadata).toBeUndefined();
        });
    });

    describe('has()', () => {
        it('should return true if image is loaded', async () => {
            await ImageLoader.load({ img1: mockImageUrl });

            expect(ImageLoader.has('img1')).toBe(true);
        });

        it('should return false if image is not loaded', () => {
            expect(ImageLoader.has('nonexistent')).toBe(false);
        });
    });

    describe('unload()', () => {
        it('should unload an HTMLImageElement', async () => {
            await ImageLoader.load({ img1: mockImageUrl });

            expect(ImageLoader.has('img1')).toBe(true);

            ImageLoader.unload('img1');

            expect(ImageLoader.has('img1')).toBe(false);
        });

        it('should unload an ImageBitmap and call close()', async () => {
            await ImageLoader.load({ img1: mockImageUrl }, { useBitmap: true });

            const bitmap = ImageLoader.get('img1') as ImageBitmap;
            const closeSpy = vi.spyOn(bitmap, 'close');

            expect(ImageLoader.has('img1')).toBe(true);

            ImageLoader.unload('img1');

            expect(closeSpy).toHaveBeenCalled();
            expect(ImageLoader.has('img1')).toBe(false);
        });

        it('should do nothing if key does not exist', () => {
            expect(() => ImageLoader.unload('nonexistent')).not.toThrow();
        });
    });

    describe('unloadMany()', () => {
        it('should unload multiple images', async () => {
            await ImageLoader.load({
                img1: mockImageUrl,
                img2: mockImageUrl2,
            });

            expect(ImageLoader.size()).toBe(2);

            ImageLoader.unloadMany(['img1', 'img2']);

            expect(ImageLoader.size()).toBe(0);
        });
    });

    describe('clear()', () => {
        it('should clear all loaded images', async () => {
            await ImageLoader.load({
                img1: mockImageUrl,
                img2: mockImageUrl2,
            });

            expect(ImageLoader.size()).toBe(2);

            ImageLoader.clear();

            expect(ImageLoader.size()).toBe(0);
        });

        it('should call close() on all ImageBitmaps', async () => {
            await ImageLoader.load(
                {
                    img1: mockImageUrl,
                    img2: mockImageUrl2,
                },
                { useBitmap: true },
            );

            const bitmap1 = ImageLoader.get('img1') as ImageBitmap;
            const bitmap2 = ImageLoader.get('img2') as ImageBitmap;

            const closeSpy1 = vi.spyOn(bitmap1, 'close');
            const closeSpy2 = vi.spyOn(bitmap2, 'close');

            ImageLoader.clear();

            expect(closeSpy1).toHaveBeenCalled();
            expect(closeSpy2).toHaveBeenCalled();
        });
    });

    describe('keys()', () => {
        it('should return all loaded image keys', async () => {
            await ImageLoader.load({
                img1: mockImageUrl,
                img2: mockImageUrl2,
            });

            const keys = ImageLoader.keys();

            expect(keys).toEqual(expect.arrayContaining(['img1', 'img2']));
            expect(keys).toHaveLength(2);
        });

        it('should return empty array when no images are loaded', () => {
            const keys = ImageLoader.keys();
            expect(keys).toEqual([]);
        });
    });

    describe('size()', () => {
        it('should return the number of loaded images', async () => {
            expect(ImageLoader.size()).toBe(0);

            await ImageLoader.load({
                img1: mockImageUrl,
                img2: mockImageUrl2,
            });

            expect(ImageLoader.size()).toBe(2);

            ImageLoader.unload('img1');

            expect(ImageLoader.size()).toBe(1);
        });
    });
});
