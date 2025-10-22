import { type Constructor, type TypedArray, isArray } from '@hatti/shared';
import type { PackedArray, PackedArrayConstructor } from './PackedBuffer.js';

/**
 * Structure-of-arrays container for storing entity attributes in typed arrays.
 *
 * Provides efficient storage for collections of entities with multiple attributes
 * by storing each attribute in a separate contiguous array (SOA layout), which
 * improves cache locality and enables better JIT optimizations.
 *
 * TypedArrays provide consistent 2-10x performance improvements over regular arrays
 * for numerical computations due to contiguous memory layout and lack of boxing overhead.
 * Modern JS engines may apply SIMD auto-vectorization in some cases, though this is
 * not guaranteed and varies by engine and access pattern.
 *
 * This base class uses indices directly as entity identifiers. For sparse entity IDs
 * or systems with frequent entity creation/deletion, use DenseAttributeTable instead.
 *
 * @template Type - Object type defining attribute names and their value types
 *
 * @example
 * ```typescript
 * interface Transform {
 *     position: [x: number, y: number];
 *     rotation: number;
 * }
 *
 * const table = new AttributeTable<Transform>(1000);
 * table.addAttribute('position', Vector2Float32Array);
 * table.addAttribute('rotation', Float32Array);
 *
 * // Use indices 0, 1, 2, ... as entity IDs
 * table.setAttribute(0, 'position', [10, 20]);
 * table.setAttribute(0, 'rotation', Math.PI);
 *
 * const pos = table.getAttribute(0, 'position'); // [10, 20]
 * ```
 */
class AttributeTable<Type> {
    #fields:   Record<keyof Type, TypedArray | PackedArray>;

    #capacity: number;

    /**
     * Creates a new AttributeTable with the specified capacity.
     *
     * @param capacity - Maximum number of entities the table can store
     */
    public constructor(capacity: number) {
        this.#capacity = capacity;
        this.#fields   = {} as Record<keyof Type, TypedArray | PackedArray>;
    }

    /**
     * Adds a new attribute column to the table.
     *
     * Creates a new typed array or packed buffer to store values for this attribute
     * across all entities. The storage is automatically sized to match the table's capacity.
     *
     * @param name    - Attribute name (must be a key of Type)
     * @param storage - TypedArray or PackedArray constructor
     *
     * @example
     * ```typescript
     * table.addAttribute('position', Vector2Float32Array);
     * table.addAttribute('health', Float32Array);
     * ```
     */
    public addAttribute<Key extends keyof Type>(
        name:    Key,
        storage: Constructor<TypedArray> | PackedArrayConstructor,
    ): void {
        if (this.hasAttribute(name)) {
            console.warn(`[AttributeTable::addAttribute]: Attribute '${String(name)}' already exists`);
            return;
        }

        this.#fields[name] = new storage(this.#capacity);
    }

    /**
     * Checks if an attribute exists in the table.
     *
     * @param   name - Attribute name to check
     * @returns        True if the attribute exists
     */
    public hasAttribute<Key extends keyof Type>(name: Key): boolean {
        return name in this.#fields;
    }

    /**
     * Gets the underlying storage array for an attribute.
     *
     * Returns direct access to the typed array or packed array storing
     * all values for this attribute across all entities. Useful for bulk
     * operations, iterations, or passing data to external libraries.
     *
     * @param   name - Attribute name
     * @returns        The underlying TypedArray or PackedArray, or undefined if attribute doesn't exist
     */
    public getAttributeArray<Key extends keyof Type>(name: Key): TypedArray | PackedArray | undefined {
        if (!this.hasAttribute(name)) {
            console.warn(`[AttributeTable::getAttributeArray]: Attribute '${String(name)}' does not exist`);
            return undefined;
        }

        return this.#fields[name];
    }

    /**
     * Gets the value of an attribute for a specific entity.
     *
     * Performs bounds checking and attribute existence validation.
     * For performance-critical code, use `getAttributeUnchecked`.
     *
     * @param   index - Entity index (must be in range [0, capacity))
     * @param   name  - Attribute name
     * @returns         Attribute value, or undefined if index/attribute is invalid
     */
    public getAttribute<Key extends keyof Type>(index: number, name: Key): Type[Key] | undefined {
        if (index < 0 || index >= this.#capacity) {
            console.warn(`[AttributeTable::getAttribute]: Index ${index} out of range [0, ${this.#capacity})`);
            return undefined;
        }

        if (!this.hasAttribute(name)) {
            console.warn(`[AttributeTable::getAttribute]: Attribute '${String(name)}' does not exist`);
            return undefined;
        }

        return this.#fields[name].at(index) as Type[Key];
    }

    /**
     * Gets the value of an attribute for a specific entity without bounds checking.
     *
     * Faster than `getAttribute` but provides no safety guarantees.
     * Only use when you can guarantee index is valid and attribute exists.
     *
     * @param   index - Entity index
     * @param   name  - Attribute name
     * @returns         Attribute value (number or array depending on attribute type)
     */
    public getAttributeUnchecked<Key extends keyof Type>(index: number, name: Key): Type[Key] {
        return this.#fields[name].at(index) as Type[Key];
    }

    /**
     * Sets the value of an attribute for a specific entity.
     *
     * Performs bounds checking and attribute existence validation.
     * For performance-critical code, use `setAttributeUnchecked`.
     *
     * @param index - Entity index (must be in range [0, capacity))
     * @param name  - Attribute name
     * @param value - New value (number or array depending on attribute type)
     *
     * @example
     * ```typescript
     * table.setAttribute(0, 'position', [10, 20]);
     * table.setAttribute(0, 'rotation', Math.PI);
     * ```
     */
    public setAttribute<Key extends keyof Type>(index: number, name: Key, value: Type[Key]): void {
        if (index < 0 || index >= this.#capacity) {
            console.warn(`[AttributeTable::setAttribute]: Index ${index} out of range [0, ${this.#capacity})`);
            return;
        }

        if (!this.hasAttribute(name)) {
            console.warn(`[AttributeTable::setAttribute]: Attribute '${String(name)}' does not exist`);
            return;
        }

        const _value = (isArray(value) ? value : [value]) as number[];

        this.#fields[name].set(_value, index);
    }

    /**
     * Sets the value of an attribute for a specific entity without bounds checking.
     *
     * Faster than `setAttribute` but provides no safety guarantees.
     * Only use when you can guarantee index is valid and attribute exists.
     *
     * @param index - Entity index
     * @param name  - Attribute name
     * @param value - New value (number or array depending on attribute type)
     */
    public setAttributeUnchecked<Key extends keyof Type>(index: number, name: Key, value: Type[Key]): void {
        const _value = (isArray(value) ? value : [value]) as number[];

        this.#fields[name].set(_value, index);
    }

    /**
     * Gets all attribute values for a specific entity as an object.
     *
     * Returns an object containing all attributes for the entity. Only includes
     * attributes that have been added to the table. Useful for serialization,
     * debugging, or working with entity data as a whole.
     *
     * @param   index - Entity index (must be in range [0, capacity))
     * @returns         Object with all attribute values, or undefined if index is invalid
     */
    public getEntityAttributes(index: number): Partial<Type> | undefined {
        if (index < 0 || index >= this.#capacity) {
            console.warn(`[AttributeTable::getEntityAttributes]: Index ${index} out of range [0, ${this.#capacity})`);
            return undefined;
        }

        const result: Partial<Type> = {};

        for (const key in this.#fields) {
            result[key] = this.#fields[key].at(index) as Type[typeof key];
        }

        return result;
    }

    /**
     * Clears all attribute values for a specific entity.
     *
     * Resets all attributes for the entity at the given index to zero.
     * Does not perform bounds checking for performance.
     *
     * @param index - Entity index to clear
     */
    public clearEntity(index: number): void {
        for (const key in this.#fields) {
            const field = this.#fields[key];
            const zeros = new Array((field as PackedArray)?.stride ?? 1).fill(0);

            field.set(zeros, index);
        }
    }

    /**
     * Gets the maximum number of entities the table can store.
     *
     * @returns Maximum capacity
     */
    public get capacity(): number {
        return this.#capacity;
    }
}

export default AttributeTable;
