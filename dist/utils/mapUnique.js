export function mapUnique(arr, fn) {
    const set = new Set();
    for (const item of arr) {
        set.add(fn(item));
    }
    return Array.from(set);
}
//# sourceMappingURL=mapUnique.js.map