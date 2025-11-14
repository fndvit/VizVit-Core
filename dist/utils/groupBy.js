export function groupBy(arr, keyFn, mapFn) {
    return arr.reduce((acc, item) => {
        const key = keyFn(item);
        acc[key] = acc[key] || [];
        acc[key].push(mapFn ? mapFn(item) : item);
        return acc;
    }, {});
}
//# sourceMappingURL=groupBy.js.map