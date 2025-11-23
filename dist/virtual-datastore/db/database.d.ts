import type { Dataset, Row } from "./types.js";
import { QueryBuilder } from "./queryBuilder.js";
import type { QuerySpec } from "./querySpec.js";
import type { Schema } from "./schema.js";
export declare class Database {
    private datasets;
    private cache;
    private tx;
    private schemas;
    private defaultCacheTTL;
    constructor(opts?: {
        cacheTTLMs?: number;
    });
    __internal_setDataset(name: string, ds: Dataset): void;
    addDataset(name: string, dataset: Dataset): void;
    loadFromCsvText(name: string, csvText: string): Promise<void>;
    load(url: string, name: string): Promise<void>;
    loadAll(urls: string[], options?: {
        validate?: boolean;
    }): Promise<boolean>;
    /**
     * Validate a dataset against a schema
     *
     * @param dataset Dataset name to validate
     * @param schema Object that defines the expected type of each field
     * @param opts.coerce If true, attempts to convert values to the correct type
     * @returns true if all records match the schema, false if there are errors
     */
    private validateDataset;
    private parseCSV;
    list(): string[];
    get(name: string): Dataset | undefined;
    registerSchema(name: string, schema: Schema): void;
    query(dataset: string): QueryBuilder;
    execute(spec: QuerySpec): Promise<{
        rows: Row[];
        meta: Record<string, any>;
    }>;
    private applyWhere;
    private applyRanges;
    private applyOrder;
    beginTransaction(): void;
    commitTransaction(): void;
    rollbackTransaction(): void;
    txInsert(dataset: string, row: Row): void;
    txUpdate(dataset: string, predicate: (r: Row) => boolean, patch: Partial<Row>): void;
    txDelete(dataset: string, predicate: (r: Row) => boolean): void;
    getChildren(dataset: string, level: number | null, id: string | number): Row[];
    getParent(dataset: string, id: string | number): Row | undefined;
    getMaxValueRow(dataset: string, year: number | null, metric: string): Row | undefined;
    flattenHierarchy(dataset: string): Row[];
}
