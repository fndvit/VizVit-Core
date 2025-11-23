export class HierarchyTools {
    rows;
    constructor(rows) {
        this.rows = rows;
    }
    // expects rows to have: id, parent_id (or parentId), level optional
    getChildren(datasetRows, level, id) {
        const pidKey = "parent_id" in (datasetRows[0] ?? {}) ? "parent_id" : "parentId";
        const levelKey = "level" in (datasetRows[0] ?? {}) ? "level" : null;
        return datasetRows.filter((r) => {
            if (levelKey != null && level != null && r[levelKey] !== level + 1)
                return false;
            return r[pidKey] === id;
        });
    }
    getParent(datasetRows, id) {
        const pidKey = "parent_id" in (datasetRows[0] ?? {}) ? "parent_id" : "parentId";
        const node = datasetRows.find((r) => r.id === id);
        if (!node)
            return undefined;
        const parentId = node[pidKey];
        return datasetRows.find((r) => r.id === parentId);
    }
    getMaxValueRow(datasetRows, year, metric) {
        let rows = datasetRows.slice();
        if (year != null)
            rows = rows.filter((r) => Number(r["year"]) === Number(year));
        return rows.reduce((best, r) => {
            const v = Number(r[metric]);
            if (Number.isNaN(v))
                return best;
            if (!best)
                return r;
            const bv = Number(best[metric]);
            return v > bv ? r : best;
        }, undefined);
    }
    flattenHierarchy(datasetRows) {
        // naive: topological traverse by parent-child
        const idKey = "id";
        const pidKey = "parent_id" in (datasetRows[0] ?? {}) ? "parent_id" : "parentId";
        const byId = new Map();
        for (const r of datasetRows)
            byId.set(r[idKey], r);
        const roots = datasetRows.filter((r) => r[pidKey] == null);
        const out = [];
        const visit = (node) => {
            out.push(node);
            const id = node[idKey];
            const children = datasetRows.filter((rr) => rr[pidKey] === id);
            for (const c of children)
                visit(c);
        };
        for (const r of roots)
            visit(r);
        return out;
    }
}
//# sourceMappingURL=hierarchy.js.map