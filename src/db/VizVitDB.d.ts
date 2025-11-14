import type { Dataset } from "../types/index.ts";
export declare class Database {
    private datasets;
    private baseDir;
    constructor(baseDir: string);
    /**
     * Loads all CSV files from the base directory into datasets
     */
    loadAll(): void;
    /**
     * Gets a dataset by name
     */
    get(name: string): Dataset | undefined;
    /**
     * Lists all loaded datasets
     */
    list(): string[];
}
