export declare function debounce<T extends any[]>(fn: (...args: T) => void, delay: number): {
    (..._: T): void;
    cancel(): void;
};
