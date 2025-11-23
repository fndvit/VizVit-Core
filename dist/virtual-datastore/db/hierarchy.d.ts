import type { Row } from "./types.js";
export declare class HierarchyTools {
    private rows;
    constructor(rows: Row[]);
    getChildren(datasetRows: Row[], level: number | null, id: string | number): Row[];
    getParent(datasetRows: Row[], id: string | number): Row | undefined;
    getMaxValueRow(datasetRows: Row[], year: number | null, metric: string): Row | undefined;
    flattenHierarchy(datasetRows: Row[]): Row[];
}
