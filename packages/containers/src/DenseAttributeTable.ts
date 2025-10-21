import AttributeTable from './AttributeTable.js';

/**
 * Dense attribute table that maps sparse entity IDs to dense array indices.
 *
 * Extends AttributeTable to support sparse entity IDs (with gaps from deletions)
 * while maintaining dense, cache-friendly storage. Entity IDs are mapped to
 * contiguous array indices internally, and removed entities' indices are recycled.
 *
 * Use this when entity IDs can have large gaps or when entities are frequently
 * created and destroyed. For sequential/dense entity IDs, use AttributeTable directly.
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
 * const table = new DenseAttributeTable<Transform>(1000);
 * table.addAttribute('position', Vector2Float32Array);
 * table.addAttribute('rotation', Float32Array);
 *
 * // Entity IDs can be sparse (e.g., 42, 1337, 9999)
 * table.setAttribute(42, 'position', [10, 20]);
 * table.setAttribute(1337, 'rotation', Math.PI);
 *
 * table.clearEntity(42); // Clears attributes and frees the internal index for reuse
 * ```
 */
class DenseAttributeTable<Type> extends AttributeTable<Type> {
    #entityToIndex: Map<number, number>;

    #freeIndices:   number[];

    #nextIndex:     number;

    /**
     * Creates a new DenseAttributeTable with the specified capacity.
     *
     * @param capacity - Maximum number of entities the table can store
     */
    public constructor(capacity: number) {
        super(capacity);

        this.#entityToIndex = new Map();
        this.#freeIndices   = [];
        this.#nextIndex     = 0;
    }

    /**
     * Checks if an entity exists in the table.
     *
     * @param   entityId - Entity ID to check
     * @returns            True if the entity has been added to the table
     */
    public hasEntity(entityId: number): boolean {
        return this.#entityToIndex.has(entityId);
    }

    /**
     * Clears all attribute values for a specific entity and frees its index.
     *
     * Resets all attributes for the entity to zero, removes the entity ID mapping,
     * and adds the internal index to the free list for reuse.
     *
     * @param entityId - Entity ID to clear
     */
    public override clearEntity(entityId: number): void {
        const index = this.#entityToIndex.get(entityId);

        if (index === undefined) {
            console.warn(`[DenseAttributeTable::clearEntity]: Entity ${entityId} does not exist`);
            return;
        }

        super.clearEntity(index);
        this.#entityToIndex.delete(entityId);
        this.#freeIndices.push(index);
    }

    /**
     * Gets the value of an attribute for a specific entity.
     *
     * Performs entity existence, bounds checking, and attribute validation.
     * For performance-critical code, use `getAttributeUnchecked`.
     *
     * @param   entityId - Entity ID
     * @param   name     - Attribute name
     * @returns            Attribute value, or undefined if entity doesn't exist
     */
    public override getAttribute<Key extends keyof Type>(entityId: number, name: Key): Type[Key] | undefined {
        const index = this.#entityToIndex.get(entityId);

        if (index === undefined) {
            console.warn(`[DenseAttributeTable::getAttribute]: Entity ${entityId} does not exist`);
            return undefined;
        }

        return super.getAttribute(index, name);
    }

    /**
     * Sets the value of an attribute for a specific entity.
     *
     * If the entity doesn't exist yet, it will be automatically added and assigned
     * a dense internal index (either recycled from removed entities or newly allocated).
     * Performs attribute existence validation.
     *
     * @param entityId - Entity ID
     * @param name     - Attribute name
     * @param value    - New value (number or array depending on attribute type)
     *
     * @example
     * ```typescript
     * table.setAttribute(42, 'position', [10, 20]);
     * table.setAttribute(1337, 'rotation', Math.PI);
     * ```
     */
    public override setAttribute<Key extends keyof Type>(entityId: number, name: Key, value: Type[Key]): void {
        let index = this.#entityToIndex.get(entityId);

        if (index === undefined) {
            index = this.#freeIndices.pop() ?? this.#nextIndex++;

            if (index >= this.capacity) {
                console.warn(`[DenseAttributeTable::setAttribute]: Capacity exceeded (${this.capacity})`);
                return;
            }

            this.#entityToIndex.set(entityId, index);
        }

        super.setAttribute(index, name, value);
    }

    /**
     * Gets all attribute values for a specific entity as an object.
     *
     * Returns an object containing all attributes for the entity. Only includes
     * attributes that have been added to the table.
     *
     * @param   entityId - Entity ID
     * @returns            Object with all attribute values, or undefined if entity doesn't exist
     */
    public override getEntityAttributes(entityId: number): Partial<Type> | undefined {
        const index = this.#entityToIndex.get(entityId);

        if (index === undefined) {
            console.warn(`[DenseAttributeTable::getEntityAttributes]: Entity ${entityId} does not exist`);
            return undefined;
        }

        return super.getEntityAttributes(index);
    }

    /**
     * Gets the internal dense index for an entity ID.
     *
     * Useful for debugging and testing the sparse-to-dense mapping.
     *
     * @param   entityId - Entity ID to look up
     * @returns            Internal array index, or undefined if entity doesn't exist
     */
    public getEntityIndex(entityId: number): number | undefined {
        return this.#entityToIndex.get(entityId);
    }

    /**
     * Gets all entity IDs currently in the table.
     *
     * @returns Array of active entity IDs
     */
    public getEntityIds(): number[] {
        return [...this.#entityToIndex.keys()];
    }

    /**
     * Gets the number of entities currently in the table.
     *
     * @returns Number of active entities
     */
    public get size(): number {
        return this.#entityToIndex.size;
    }
}

export default DenseAttributeTable;
