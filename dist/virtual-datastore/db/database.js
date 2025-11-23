import { QueryBuilder } from "./queryBuilder.js";
import { QueryCache } from "./cache.js";
import { HierarchyTools } from "./hierarchy.js";
import { TransactionManager } from "./transaction.js";
import { readCSVFromURL } from "../sources/csvSource.js";
export class Database {
    datasets = new Map();
    cache = new QueryCache();
    tx = new TransactionManager();
    schemas = new Map();
    defaultCacheTTL = 5 * 60 * 1000;
    constructor(opts) {
        if (opts?.cacheTTLMs)
            this.defaultCacheTTL = opts.cacheTTLMs;
    }
    // internal helper for adapters
    __internal_setDataset(name, ds) {
        this.datasets.set(name, ds);
    }
    addDataset(name, dataset) {
        if (!this.datasets.has(name)) {
            this.datasets.set(name, dataset);
        }
        else {
            throw new Error(`Dataset with name ${name} already exists.`);
        }
    }
    async loadFromCsvText(name, csvText) {
        const rows = this.parseCSV(csvText);
        this.datasets.set(name, { name, rows });
    }
    async load(url, name) {
        const res = await fetch(url);
        if (!res.ok)
            throw new Error(`Failed to load ${url}: ${res.status}`);
        const txt = await res.text();
        const rows = this.parseCSV(txt);
        this.datasets.set(name, { name, rows });
    }
    async loadAll(urls, options) {
        for (const url of urls) {
            try {
                const response = await fetch(url);
                if (!response.ok) {
                    console.warn(`No se pudo cargar CSV desde ${url}: ${response.statusText}`);
                    continue;
                }
                const rawRows = await readCSVFromURL(url);
                const rows = rawRows.map((r) => {
                    const normalized = {};
                    for (const [key, value] of Object.entries(r)) {
                        if (value === "true" || value === "false")
                            normalized[key] = value === "true";
                        else if (!isNaN(Number(value)))
                            normalized[key] = Number(value);
                        else if (typeof value === "string")
                            normalized[key] = String(value);
                        else if (typeof value === "boolean")
                            normalized[key] = value;
                        else
                            normalized[key] = String(value);
                    }
                    return normalized;
                });
                const name = url
                    .split("/")
                    .pop()
                    ?.replace(/\.csv$/, "") || url;
                this.datasets.set(name, { name, rows });
                // VALIDACIÓN opcional
                if (options?.validate && this.schemas.has(name)) {
                    const schema = this.schemas.get(name);
                    console.log("validating dataset", name, schema);
                    this.validateDataset(name, schema, { coerce: true });
                }
                return true;
            }
            catch (err) {
                throw new Error(`Error loading CSV from ${url}: ${err}`);
            }
        }
        return false;
    }
    /**
     * Validate a dataset against a schema
     *
     * @param dataset Dataset name to validate
     * @param schema Object that defines the expected type of each field
     * @param opts.coerce If true, attempts to convert values to the correct type
     * @returns true if all records match the schema, false if there are errors
     */
    validateDataset(dataset, schema, opts) {
        const ds = this.datasets.get(dataset);
        if (!ds)
            throw new Error(`Dataset ${dataset} not loaded`);
        let logLookup = {};
        for (const row of ds.rows) {
            for (const [field, ftype] of Object.entries(schema)) {
                const val = row[field];
                const actual = typeof val;
                if (!val)
                    logLookup[`missing_${field}`] = "missing";
                if (actual === ftype)
                    continue; // matches expected type
                // try coercion if enabled
                if (opts?.coerce) {
                    if (ftype === "number" &&
                        typeof val === "string" &&
                        !isNaN(Number(val))) {
                        row[field] = Number(val);
                        continue;
                    }
                    if (ftype === "boolean" && typeof val === "string") {
                        const s = val.toLowerCase();
                        if (s === "true" || s === "false") {
                            row[field] = s === "true";
                            continue;
                        }
                    }
                    // If we reach here, coercion failed
                    logLookup[`invalid_${field}`] = {
                        expected: ftype,
                        actual,
                        value: val,
                    };
                }
            }
        }
        if (logLookup && Object.keys(logLookup).length > 0) {
            console.warn(`Dataset ${dataset} has schema validation issues:`, logLookup);
            return false;
        }
        // Store the schema in the schemas map
        this.schemas.set(dataset, schema);
        return true;
    }
    parseCSV(csv) {
        const lines = csv.split(/\r?\n/).filter(Boolean);
        if (lines.length === 0)
            return [];
        const headers = lines[0].split(",").map((h) => h.trim());
        return lines.slice(1).map((line) => {
            const vals = line.split(",");
            const row = {};
            headers.forEach((h, i) => {
                const raw = vals[i] ?? "";
                const n = raw.trim();
                if (n === "true" || n === "false")
                    row[h] = n === "true";
                else if (n !== "" && !Number.isNaN(Number(n)))
                    row[h] = Number(n);
                else if (n === "")
                    row[h] = null;
                else
                    row[h] = n;
            });
            return row;
        });
    }
    list() {
        return [...this.datasets.keys()];
    }
    get(name) {
        return this.datasets.get(name);
    }
    registerSchema(name, schema) {
        this.schemas.set(name, schema);
    }
    query(dataset) {
        return new QueryBuilder(dataset);
    }
    // execute a QuerySpec
    async execute(spec) {
        const key = JSON.stringify(spec);
        const cached = this.cache.get(key);
        const meta = {};
        if (cached)
            return cached;
        const ds = this.datasets.get(spec.dataset);
        if (!ds)
            return { rows: [], meta: {} };
        let rows = ds.rows.slice();
        // where clauses
        if (spec.where)
            rows = this.applyWhere(rows, spec.where);
        if (spec.ranges)
            rows = this.applyRanges(rows, spec.ranges);
        if (spec.order)
            rows = this.applyOrder(rows, spec.order);
        // select
        if (spec.select)
            rows = rows.map((r) => {
                const out = {};
                for (const f of spec.select)
                    out[f] = r[f];
                return out;
            });
        // aggregates (we return rows as-is but attach meta in _aggregates if asked)
        if (spec.aggregates && spec.aggregates.length) {
            for (const a of spec.aggregates) {
                if (a.type === "count")
                    meta.count = rows.length;
                else if (a.type === "sum")
                    meta[`sum_${a.field}`] = rows.reduce((s, r) => s + (Number(r[a.field]) || 0), 0);
                else if (a.type === "avg")
                    meta[`avg_${a.field}`] =
                        rows.reduce((s, r) => s + (Number(r[a.field]) || 0), 0) /
                            (rows.length || 1);
                else if (a.type === "min")
                    meta[`min_${a.field}`] = rows.reduce((m, r) => {
                        const v = Number(r[a.field]);
                        return Number.isNaN(v) ? m : m == null ? v : Math.min(m, v);
                    }, null);
                else if (a.type === "max")
                    meta[`max_${a.field}`] = rows.reduce((m, r) => {
                        const v = Number(r[a.field]);
                        return Number.isNaN(v) ? m : m == null ? v : Math.max(m, v);
                    }, null);
            }
        }
        if (spec.offset)
            rows = rows.slice(spec.offset);
        if (spec.limit)
            rows = rows.slice(0, spec.limit);
        this.cache.set(key, rows, this.defaultCacheTTL);
        return { rows, meta };
    }
    applyWhere(rows, clauses) {
        return rows.filter((row) => {
            return (clauses ?? []).every((c) => {
                const val = row[c.field];
                if (c.op === "LIKE") {
                    const patt = String(c.value).replace(/%/g, ".*");
                    return new RegExp(`^${patt}$`, "i").test(String(val ?? ""));
                }
                if (c.op === "IN")
                    return Array.isArray(c.value) && c.value.includes(val);
                if (c.op === "=")
                    return val == c.value;
                if (c.op === "!=")
                    return val != c.value;
                if ([">", ">=", "<", "<="].includes(c.op)) {
                    const num = Number(val);
                    const cmp = Number(c.value);
                    if (Number.isNaN(num) || Number.isNaN(cmp))
                        return false;
                    switch (c.op) {
                        case ">":
                            return num > cmp;
                        case ">=":
                            return num >= cmp;
                        case "<":
                            return num < cmp;
                        case "<=":
                            return num <= cmp;
                    }
                }
                return false;
            });
        });
    }
    applyRanges(rows, ranges) {
        return rows.filter((row) => ranges.every((r) => {
            const v = Number(row[r.field]);
            if (Number.isNaN(v))
                return false;
            return v >= r.from && v <= r.to;
        }));
    }
    applyOrder(rows, order) {
        return rows.sort((a, b) => {
            for (const o of order) {
                const av = a[o.field];
                const bv = b[o.field];
                if (av == null && bv == null)
                    continue;
                if (av == null)
                    return o.direction === "asc" ? -1 : 1;
                if (bv == null)
                    return o.direction === "asc" ? 1 : -1;
                if (av < bv)
                    return o.direction === "asc" ? -1 : 1;
                if (av > bv)
                    return o.direction === "asc" ? 1 : -1;
            }
            return 0;
        });
    }
    // transaction helpers (in-memory optimistic)
    beginTransaction() {
        this.tx.begin();
    }
    commitTransaction() {
        const ops = this.tx.getOps();
        for (const op of ops) {
            if (op.op === "insert") {
                const ds = this.datasets.get(op.dataset);
                if (!ds)
                    continue;
                ds.rows.push(op.row);
            }
            else if (op.op === "update") {
                const ds = this.datasets.get(op.dataset);
                if (!ds)
                    continue;
                for (let i = 0; i < ds.rows.length; i++) {
                    if (op.predicate(ds.rows[i])) {
                        let patchFiltered = {};
                        for (const key in op.patch) {
                            const val = op.patch[key];
                            if (val !== undefined)
                                patchFiltered[key] = val;
                        }
                        ds.rows[i] = { ...ds.rows[i], ...patchFiltered };
                    }
                }
            }
            else if (op.op === "delete") {
                const ds = this.datasets.get(op.dataset);
                if (!ds)
                    continue;
                ds.rows = ds.rows.filter((r) => !op.predicate(r));
            }
        }
        this.tx.clear();
    }
    rollbackTransaction() {
        this.tx.clear();
    }
    txInsert(dataset, row) {
        this.tx.add({ op: "insert", dataset, row });
    }
    txUpdate(dataset, predicate, patch) {
        this.tx.add({ op: "update", dataset, predicate, patch });
    }
    txDelete(dataset, predicate) {
        this.tx.add({ op: "delete", dataset, predicate });
    }
    // hierarchy helpers
    getChildren(dataset, level, id) {
        const ds = this.datasets.get(dataset);
        if (!ds)
            return [];
        const ht = new HierarchyTools(ds.rows);
        return ht.getChildren(ds.rows, level, id);
    }
    getParent(dataset, id) {
        const ds = this.datasets.get(dataset);
        if (!ds)
            return undefined;
        const ht = new HierarchyTools(ds.rows);
        return ht.getParent(ds.rows, id);
    }
    getMaxValueRow(dataset, year, metric) {
        const ds = this.datasets.get(dataset);
        if (!ds)
            return undefined;
        const ht = new HierarchyTools(ds.rows);
        return ht.getMaxValueRow(ds.rows, year, metric);
    }
    flattenHierarchy(dataset) {
        const ds = this.datasets.get(dataset);
        if (!ds)
            return [];
        const ht = new HierarchyTools(ds.rows);
        return ht.flattenHierarchy(ds.rows);
    }
}
//# sourceMappingURL=database.js.map