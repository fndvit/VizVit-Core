export function debounce(fn, delay) {
    let timeout;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const ret = (..._) => {
        clearTimeout(timeout);
        timeout = setTimeout(fn, delay);
    };
    ret.cancel = () => clearTimeout(timeout);
    return ret;
}
//# sourceMappingURL=debounce.js.map