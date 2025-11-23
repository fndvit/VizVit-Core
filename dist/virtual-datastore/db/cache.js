export class QueryCache {
    cache = new Map();
    maxEntries;
    constructor(opts) {
        this.maxEntries = opts?.maxEntries ?? 500;
    }
    get(key) {
        const e = this.cache.get(key);
        if (!e)
            return undefined;
        if (e.ttl && Date.now() - e.ts > e.ttl) {
            this.cache.delete(key);
            return undefined;
        }
        e.ts = Date.now(); // touch
        return e.value;
    }
    set(key, value, ttl) {
        if (this.cache.size >= this.maxEntries) {
            // simple eviction: drop oldest
            let oldestKey = null;
            let oldestTs = Infinity;
            for (const [k, v] of this.cache.entries()) {
                if (v.ts < oldestTs) {
                    oldestTs = v.ts;
                    oldestKey = k;
                }
            }
            if (oldestKey)
                this.cache.delete(oldestKey);
        }
        this.cache.set(key, { ts: Date.now(), ttl, value });
    }
    clear() {
        this.cache.clear();
    }
}
//# sourceMappingURL=cache.js.map