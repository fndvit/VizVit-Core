export function createLookupFromArrayOfObjects(arr, keyFn, valFn) {
    const lookup = {};
    const _valFn = (valFn ?? ((d) => d));
    arr.forEach((d) => {
        const key = keyFn(d);
        if (typeof key === "string" || typeof key === "number") {
            lookup[key] = _valFn(d);
        }
        else {
            key.forEach((k) => (lookup[k] = _valFn(d)));
        }
    });
    return lookup;
}
//# sourceMappingURL=createLookup.js.map