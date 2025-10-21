/**
 * Represents a cell value in a binary mask.
 */
export type CellValue = 0 | 1;

/**
 * Rectangular bounds for a quadtree node.
 */
export interface Bounds {
    readonly x:    number;
    readonly y:    number;
    readonly size: number;
}

/**
 * Node in a quadtree structure for spatial partitioning of binary masks.
 *
 * Used for efficient representation and edge detection of 2D binary grids.
 * Recursively subdivides non-uniform regions into quadrants until reaching
 * uniform cells or minimum size (1x1).
 */
class QuadTreeNode {
    public readonly bounds: Bounds;

    public readonly value:  CellValue | null;

    public children:        QuadTreeNode[];

    /**
     * Creates a new quadtree node.
     *
     * @param bounds - Spatial bounds of this node
     * @param value  - Uniform value (0 or 1) if leaf, null if has children
     */
    public constructor(bounds: Bounds, value: CellValue | null = null) {
        this.bounds = bounds;
        this.value = value;
        this.children = [];
    }

    /**
     * Builds a quadtree from a 2D binary mask.
     *
     * Recursively subdivides non-uniform regions until reaching uniform cells
     * or minimum size (1x1).
     *
     * @param   mask - 2D array of binary values
     * @param   x    - Starting x coordinate
     * @param   y    - Starting y coordinate
     * @param   size - Size of the region (must be power of 2)
     * @returns        Root node of the constructed quadtree
     */
    public static buildFromMask(mask: CellValue[][], x: number, y: number, size: number): QuadTreeNode {
        const value = QuadTreeNode.getUniformValue(mask, x, y, size);

        const node = new QuadTreeNode(
            {
                x, y, size,
            }, value,
        );

        if (value === null && size > 1) {
            const half = size / 2;

            node.children = [
                this.buildFromMask(mask, x, y, half),
                this.buildFromMask(mask, x + half, y, half),
                this.buildFromMask(mask, x, y + half, half),
                this.buildFromMask(mask, x + half, y + half, half),
            ];
        }

        return node;
    }

    /**
     * Checks if a region has a uniform value.
     *
     * @param   mask - 2D binary mask
     * @param   x    - Starting x coordinate
     * @param   y    - Starting y coordinate
     * @param   size - Size of region to check
     * @returns        The uniform value (0 or 1), or null if region is mixed
     */
    private static getUniformValue(mask: CellValue[][], x: number, y: number, size: number): CellValue | null {
        const firstRow = mask[y];

        if (!firstRow || x >= firstRow.length) {
            return null;
        }

        const first = firstRow[x];

        if (first === undefined) {
            return null;
        }

        for (let dy = 0; dy < size; dy++) {
            const row = mask[y + dy];

            if (!row) return null;

            for (let dx = 0; dx < size; dx++) {
                const cell = row[x + dx];

                if (cell === undefined || cell !== first) {
                    return null;
                }
            }
        }

        return first;
    }

    /**
     * Finds all leaf nodes that are adjacent to cells with different values.
     *
     * @param   mask - Original 2D binary mask
     * @returns        Array of bounds for nodes on edges
     */
    public getEdges(mask: CellValue[][]): Bounds[] {
        const edges: Bounds[] = [];

        const checkEdge = (x: number, y: number, size: number, val: CellValue): boolean => {
            for (let dy = -1; dy <= size; dy++) {
                for (let dx = -1; dx <= size; dx++) {
                    const mx = x + dx;
                    const my = y + dy;

                    if (dx === -1 || dy === -1 || dx === size || dy === size) {
                        if (mask[my]?.[mx] !== val) return true;
                    }
                }
            }

            return false;
        };

        const visit = (node: QuadTreeNode): void => {
            if (node.isLeaf && node.value !== null) {
                const {
                    x, y, size,
                } = node.bounds;

                if (checkEdge(x, y, size, node.value)) {
                    edges.push(node.bounds);
                }
            } else {
                for (const child of node.children) {
                    visit(child);
                }
            }
        };

        visit(this);

        return edges;
    }

    /**
     * Checks if this node is a leaf (has no children).
     *
     * @returns True if node is a leaf, false otherwise
     */
    public get isLeaf(): boolean {
        return this.children.length === 0;
    }

    /**
     * Counts total number of nodes in the tree.
     *
     * @returns Total node count including this node and all descendants
     */
    public countNodes(): number {
        let count = 1; // Count self

        for (const child of this.children) {
            count += child.countNodes();
        }

        return count;
    }

    /**
     * Gets all leaf nodes with a specific value.
     *
     * @param   value - The cell value to search for (0 or 1)
     * @returns       Array of bounds for all matching leaf nodes
     */
    public getNodesWithValue(value: CellValue): Bounds[] {
        const nodes: Bounds[] = [];

        const visit = (node: QuadTreeNode): void => {
            if (node.isLeaf && node.value === value) {
                nodes.push(node.bounds);
            } else {
                for (const child of node.children) {
                    visit(child);
                }
            }
        };

        visit(this);

        return nodes;
    }
}

export default QuadTreeNode;
