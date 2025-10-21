import type { TypedArray, Constructor } from '@hatti/shared';

/**
 * Base class for storing collections of fixed-size numeric arrays in packed typed arrays.
 *
 * Provides efficient packed storage and access patterns for collections of
 * vectors, matrices, and other fixed-size data using typed arrays with configurable stride.
 */
class PackedBuffer<Type extends TypedArray> {
    #tempArr: number[];

    public readonly stride: number;

    public readonly count:  number;

    public readonly data: Type;

    /**
     * Creates a new PackedBuffer.
     *
     * @param typedArrayCtor - Constructor for the typed array (e.g., Float32Array, Uint32Array)
     * @param stride         - Number of elements per item
     * @param count          - Number of items to store
     */
    public constructor(typedArrayCtor: Constructor<Type>, stride: number, count: number) {
        this.stride = stride;
        this.count  = count;
        this.data   = new typedArrayCtor(count * stride);

        this.#tempArr = new Array(stride);
    }

    /**
     * Gets an item at the specified index.
     *
     * @param   offset - Index of the item to retrieve
     * @param   target - Optional array to write results into (avoids allocation)
     * @returns          Array containing the item elements
     */
    public at(offset: number, target?: number[]): number[] {
        const _index = offset * this.stride;
        const arr    = target ?? this.#tempArr;

        for (let i = 0; i < this.stride; i++) {
            arr[i] = this.data[_index + i]!;
        }

        return arr;
    }

    /**
     * Sets an item at the specified index.
     *
     * @param value  - Array containing the item elements
     * @param offset - Index where to store the item
     */
    public set(value: number[], offset: number): void {
        const _index = offset * this.stride;

        for (let i = 0; i < this.stride; i++) {
            this.data[_index + i] = value[i]!;
        }
    }

    /**
     * Iterates over all items in the array.
     *
     * @yields Arrays containing each item
     */
    public *[Symbol.iterator](): Generator<number[], void, undefined> {
        for (let i = 0; i < this.count; i++) {
            yield this.at(i, []);
        }
    }
}

/**
 * Container for storing multiple 2D vectors as Uint32Array.
 */
export class Vector2Uint32Array extends PackedBuffer<Uint32Array> {
    /**
     * Creates a new Vector2Uint32Array.
     *
     * @param length - Number of 2D vectors to store
     */
    public constructor(length: number) {
        super(Uint32Array, 2, length);
    }
}

/**
 * Container for storing multiple 3D vectors as Uint32Array.
 */
export class Vector3Uint32Array extends PackedBuffer<Uint32Array> {
    /**
     * Creates a new Vector3Uint32Array.
     *
     * @param length - Number of 3D vectors to store
     */
    public constructor(length: number) {
        super(Uint32Array, 3, length);
    }
}

/**
 * Container for storing multiple 2D vectors as Float32Array.
 */
export class Vector2Float32Array extends PackedBuffer<Float32Array> {
    /**
     * Creates a new Vector2Float32Array.
     *
     * @param length - Number of 2D vectors to store
     */
    public constructor(length: number) {
        super(Float32Array, 2, length);
    }
}

/**
 * Container for storing multiple 3D vectors as Float32Array.
 */
export class Vector3Float32Array extends PackedBuffer<Float32Array> {
    /**
     * Creates a new Vector3Float32Array.
     *
     * @param length - Number of 3D vectors to store
     */
    public constructor(length: number) {
        super(Float32Array, 3, length);
    }
}

/**
 * Container for storing multiple 3x3 matrices as Float32Array.
 */
export class Matrix3Float32Array extends PackedBuffer<Float32Array> {
    /**
     * Creates a new Matrix3Float32Array.
     *
     * @param length - Number of 3x3 matrices to store
     */
    public constructor(length: number) {
        super(Float32Array, 9, length);
    }
}

/**
 * Container for storing multiple 4x4 matrices as Float32Array.
 */
export class Matrix4Float32Array extends PackedBuffer<Float32Array> {
    /**
     * Creates a new Matrix4Float32Array.
     *
     * @param length - Number of 4x4 matrices to store
     */
    public constructor(length: number) {
        super(Float32Array, 16, length);
    }
}

export default PackedBuffer;
