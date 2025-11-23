export declare class QueryCache {
    private cache;
    private maxEntries;
    constructor(opts?: {
        maxEntries?: number;
    });
    get(key: string): any | undefined;
    set(key: string, value: any, ttl?: number): void;
    clear(): void;
}
