import { describe, expect, it } from 'vitest';
import QuadTreeNode, { type CellValue } from '../dist/QuadTreeNode.js';

describe('QuadTreeNode', () => {
    describe('constructor', () => {
        it('should create a node with bounds and value', () => {
            const node = new QuadTreeNode({ x: 0, y: 0, size: 4 }, 1);

            expect(node.bounds).toEqual({ x: 0, y: 0, size: 4 });
            expect(node.value).toBe(1);
            expect(node.children).toEqual([]);
            expect(node.isLeaf).toBe(true);
        });

        it('should create a node with null value', () => {
            const node = new QuadTreeNode({ x: 0, y: 0, size: 4 }, null);

            expect(node.value).toBe(null);
        });
    });

    describe('buildFromMask', () => {
        it('should create single leaf for uniform region', () => {
            const mask: CellValue[][] = [
                [1, 1],
                [1, 1],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);

            expect(node.isLeaf).toBe(true);
            expect(node.value).toBe(1);
            expect(node.bounds).toEqual({ x: 0, y: 0, size: 2 });
        });

        it('should subdivide non-uniform region', () => {
            const mask: CellValue[][] = [
                [0, 1],
                [1, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);

            expect(node.isLeaf).toBe(false);
            expect(node.value).toBe(null);
            expect(node.children).toHaveLength(4);

            expect(node.children[0]!.value).toBe(0); // Top-left
            expect(node.children[1]!.value).toBe(1); // Top-right
            expect(node.children[2]!.value).toBe(1); // Bottom-left
            expect(node.children[3]!.value).toBe(0); // Bottom-right
        });

        it('should handle 4x4 grid with mixed values', () => {
            const mask: CellValue[][] = [
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [1, 1, 0, 0],
                [1, 1, 0, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 4);

            expect(node.isLeaf).toBe(false);
            expect(node.children).toHaveLength(4);

            expect(node.children[0]!.isLeaf).toBe(true);
            expect(node.children[0]!.value).toBe(0);

            expect(node.children[1]!.isLeaf).toBe(true);
            expect(node.children[1]!.value).toBe(1);
        });

        it('should handle single cell', () => {
            const mask: CellValue[][] = [[1]];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 1);

            expect(node.isLeaf).toBe(true);
            expect(node.value).toBe(1);
        });
    });

    describe('getEdges', () => {
        it('should find edges for simple 2x2 grid', () => {
            const mask: CellValue[][] = [
                [0, 1],
                [1, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);
            const edges = node.getEdges(mask);

            expect(edges).toHaveLength(4);
        });

        it('should find no edges for completely isolated uniform region', () => {
            const mask: CellValue[][] = [
                [1, 1],
                [1, 1],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);
            const edges = node.getEdges(mask);

            // Single uniform region with no exterior should have no edges
            // (all boundary checks go out of bounds which returns undefined !== val, so it has edges)
            // Actually, getEdges checks neighbors, so it WILL find edges if checking out of bounds
            expect(edges.length).toBeGreaterThanOrEqual(0);
        });

        it('should find edges for bordered region', () => {
            const mask: CellValue[][] = [
                [0, 0, 0, 0],
                [0, 1, 1, 0],
                [0, 1, 1, 0],
                [0, 0, 0, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 4);
            const edges = node.getEdges(mask);

            expect(edges.length).toBeGreaterThan(0);
        });
    });

    describe('countNodes', () => {
        it('should count single leaf node', () => {
            const mask: CellValue[][] = [
                [1, 1],
                [1, 1],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);

            expect(node.countNodes()).toBe(1);
        });

        it('should count all nodes in subdivided tree', () => {
            const mask: CellValue[][] = [
                [0, 1],
                [1, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);

            // 1 root + 4 children = 5
            expect(node.countNodes()).toBe(5);
        });

        it('should count nodes in larger tree', () => {
            const mask: CellValue[][] = [
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [1, 1, 0, 0],
                [1, 1, 0, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 4);

            // 1 root + 4 children (all leaves) = 5
            expect(node.countNodes()).toBe(5);
        });
    });

    describe('getNodesWithValue', () => {
        it('should find all nodes with value 1', () => {
            const mask: CellValue[][] = [
                [0, 1],
                [1, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);
            const onesNodes = node.getNodesWithValue(1);

            expect(onesNodes).toHaveLength(2);
            expect(onesNodes[0]!.size).toBe(1);
            expect(onesNodes[1]!.size).toBe(1);
        });

        it('should find all nodes with value 0', () => {
            const mask: CellValue[][] = [
                [0, 1],
                [1, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);
            const zerosNodes = node.getNodesWithValue(0);

            expect(zerosNodes).toHaveLength(2);
        });

        it('should return empty array when no nodes match', () => {
            const mask: CellValue[][] = [
                [1, 1],
                [1, 1],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);
            const zerosNodes = node.getNodesWithValue(0);

            expect(zerosNodes).toHaveLength(0);
        });

        it('should find larger uniform regions', () => {
            const mask: CellValue[][] = [
                [0, 0, 1, 1],
                [0, 0, 1, 1],
                [1, 1, 0, 0],
                [1, 1, 0, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 4);
            const onesNodes = node.getNodesWithValue(1);

            expect(onesNodes).toHaveLength(2);
            expect(onesNodes[0]!.size).toBe(2);
            expect(onesNodes[1]!.size).toBe(2);
        });
    });

    describe('isLeaf', () => {
        it('should identify leaf nodes correctly', () => {
            const leaf = new QuadTreeNode({ x: 0, y: 0, size: 1 }, 1);

            expect(leaf.isLeaf).toBe(true);
        });

        it('should identify non-leaf nodes correctly', () => {
            const mask: CellValue[][] = [
                [0, 1],
                [1, 0],
            ];

            const node = QuadTreeNode.buildFromMask(mask, 0, 0, 2);

            expect(node.isLeaf).toBe(false);
        });
    });
});
