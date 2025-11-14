export function omitUndefined(obj) {
    const filtered = Object.keys(obj).reduce((acc, key) => {
        if (obj[key] !== undefined)
            acc[key] = obj[key];
        return acc;
    }, {});
    return filtered;
}
//# sourceMappingURL=omitUndefined.js.map