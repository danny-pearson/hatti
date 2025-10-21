import { forEachEntry, type Constructor, type TypedArray } from '@hatti/shared';
import PackedBuffer from './PackedBuffer.js';

type StructRecord = [size: number, offset: number];

/**
 * Array of Structures buffer with named field access and automatic stride calculation.
 * Supports both scalar and vector fields with proper type inference.
 *
 * Data is stored in a packed (AoS) layout where each element's fields are
 * stored contiguously. This is efficient when accessing all fields of a single element
 * together. For column-wise access patterns, consider using a Structure of Arrays (SoA)
 * layout instead.
 */
class StructuredBuffer<RecordType, ArrType extends TypedArray> extends PackedBuffer<ArrType> {
    private readonly record: Record<keyof RecordType, StructRecord>;

    /**
     * Creates an AoS from a record defining field sizes.
     *
     * @param record         - Object mapping field names to their sizes (1 for scalar, N for array)
     * @param typedArrayCtor - TypedArray constructor (Float32Array, Uint32Array, etc.)
     * @param count          - Number of elements to allocate
     */
    public constructor(
        record:         Record<keyof RecordType, number>,
        typedArrayCtor: Constructor<ArrType>,
        count:          number,
    ) {
        let stride = 0;

        const _record = {} as Record<keyof RecordType, StructRecord>;

        forEachEntry(record, ([key, size]) => {
            const offset = stride;

            stride += size;
            _record[key] = [size, offset];
        });

        super(typedArrayCtor, stride, count);

        this.record = _record;
    }

    /**
     * Gets a component value by field name.
     * Returns a single number for scalar fields, or an array for vector fields.
     *
     * @param   index - The element index
     * @param   key   - The field name
     * @returns         The component value (number or number array)
     */
    public getField<Key extends keyof RecordType>(index: number, key: Key): RecordType[Key] {
        const [size, offset] = this.record[key];

        if (size === 1) {
            return this.data[index * this.stride + offset] as RecordType[Key];
        }

        const arr = new Array(size);

        for (let i = 0; i < size; i++) {
            arr[i] = this.data[index * this.stride + offset + i]!;
        }

        return arr as RecordType[Key];
    }

    /**
     * Sets a component value by field name.
     *
     * @param index - The element index
     * @param key   - The field name
     * @param value - The value to set (number or number array)
     */
    public setField<Key extends keyof RecordType>(
        index: number,
        key:   Key,
        value: RecordType[Key],
    ): void {
        const [size, offset] = this.record[key]!;

        if (size === 1) {
            this.data[index * this.stride + offset] = value as number;
        } else {
            const arr = value as number[];

            for (let i = 0; i < size; i++) {
                this.data[index * this.stride + offset + i] = arr[i]!;
            }
        }
    }
}

export default StructuredBuffer;
