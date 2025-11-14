import type { Dataset } from "../types/index.js";
export declare class Database {
    private datasets;
    constructor();
    loadAll(urls: string[]): Promise<void>;
    get(name: string): Dataset | undefined;
    list(): string[];
}
