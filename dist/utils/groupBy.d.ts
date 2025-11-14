export declare function groupBy<T, K extends string | number>(arr: T[], keyFn: (d: T) => K): {
    [KV in K]: T[];
};
export declare function groupBy<T, K extends string | number, M>(arr: T[], keyFn: (d: T) => K, mapFn: (d: T) => M): {
    [KV in K]: M[];
};
