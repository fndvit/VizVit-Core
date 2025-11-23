import type { Row } from "./types.js";

export class HierarchyTools {
  constructor(private rows: Row[]) {}

  // expects rows to have: id, parent_id (or parentId), level optional
  getChildren(datasetRows: Row[], level: number | null, id: string | number) {
    const pidKey =
      "parent_id" in (datasetRows[0] ?? {}) ? "parent_id" : "parentId";
    const levelKey = "level" in (datasetRows[0] ?? {}) ? "level" : null;
    return datasetRows.filter((r) => {
      if (levelKey != null && level != null && r[levelKey] !== level + 1)
        return false;
      return (r as any)[pidKey] === id;
    });
  }

  getParent(datasetRows: Row[], id: string | number) {
    const pidKey =
      "parent_id" in (datasetRows[0] ?? {}) ? "parent_id" : "parentId";
    const node = datasetRows.find((r) => (r as any).id === id);
    if (!node) return undefined;
    const parentId = (node as any)[pidKey];
    return datasetRows.find((r) => (r as any).id === parentId);
  }

  getMaxValueRow(datasetRows: Row[], year: number | null, metric: string) {
    let rows = datasetRows.slice();
    if (year != null)
      rows = rows.filter((r) => Number(r["year"]) === Number(year));
    return rows.reduce<Row | undefined>((best, r) => {
      const v = Number((r as any)[metric]);
      if (Number.isNaN(v)) return best;
      if (!best) return r;
      const bv = Number((best as any)[metric]);
      return v > bv ? r : best;
    }, undefined as Row | undefined);
  }

  flattenHierarchy(datasetRows: Row[]) {
    // naive: topological traverse by parent-child
    const idKey = "id";
    const pidKey =
      "parent_id" in (datasetRows[0] ?? {}) ? "parent_id" : "parentId";
    const byId = new Map<any, Row>();
    for (const r of datasetRows) byId.set((r as any)[idKey], r);
    const roots = datasetRows.filter((r) => (r as any)[pidKey] == null);
    const out: Row[] = [];
    const visit = (node: Row) => {
      out.push(node);
      const id = (node as any)[idKey];
      const children = datasetRows.filter((rr) => (rr as any)[pidKey] === id);
      for (const c of children) visit(c);
    };
    for (const r of roots) visit(r);
    return out;
  }
}
