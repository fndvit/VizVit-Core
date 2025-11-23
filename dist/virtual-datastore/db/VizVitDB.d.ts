import type { Dataset, Row } from "../types/index.js";
export declare class Database {
    private datasets;
    private indexes;
    constructor();
    loadAll(urls: string[]): Promise<void>;
    get(name: string): Dataset | undefined;
    list(): string[];
    find(name: string, predicate: (row: Row) => boolean): Row[];
    filterBy(name: string, field: string, value: any): Row[];
    filterRange(name: string, field: string, min: number, max: number): Row[];
    sort(name: string, field: string, direction?: "asc" | "desc"): Row[];
    createIndex(dataset: string, field: string): void;
    findIndexed(dataset: string, field: string, value: any): Row[];
    join(left: string, right: string, leftKey: string, rightKey: string): Array<{
        left: Row;
        right: Row;
    }>;
}
