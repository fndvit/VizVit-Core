import type { Dataset, Row } from "../types/index.js";
import { readCSVFromURL } from "../sources/csvSource.js";

export class Database {
  private datasets: Map<string, Dataset> = new Map();
  private indexes: Map<string, Map<string, Map<any, Row[]>>> = new Map();

  constructor() {}

  async loadAll(urls: string[]): Promise<void> {
    for (const url of urls) {
      try {
        const response = await fetch(url);
        if (!response.ok) {
          console.warn(
            `No se pudo cargar CSV desde ${url}: ${response.statusText}`
          );
          continue;
        }
        const rawRows = await readCSVFromURL(url);

        const rows: Row[] = rawRows.map((r: any) => {
          const normalized: Row = {};
          for (const [key, value] of Object.entries(r)) {
            if (value === "true" || value === "false")
              normalized[key] = value === "true";
            else if (!isNaN(Number(value))) normalized[key] = Number(value);
            else if (typeof value === "string") normalized[key] = String(value);
            else if (typeof value === "boolean") normalized[key] = value;
            else normalized[key] = String(value);
          }
          return normalized;
        });

        // Usa el nombre del archivo sin extensión como key
        const name =
          url
            .split("/")
            .pop()
            ?.replace(/\.csv$/, "") || url;
        this.datasets.set(name, { name, rows });
      } catch (err) {
        console.error(`Error cargando CSV desde ${url}`, err);
      }
    }
  }

  get(name: string): Dataset | undefined {
    return this.datasets.get(name);
  }

  list(): string[] {
    return [...this.datasets.keys()];
  }

  find(name: string, predicate: (row: Row) => boolean): Row[] {
    const ds = this.datasets.get(name);
    if (!ds) return [];
    return ds.rows.filter(predicate);
  }

  filterBy(name: string, field: string, value: any): Row[] {
    const ds = this.datasets.get(name);
    if (!ds) return [];
    return ds.rows.filter((r) => r[field] === value);
  }

  filterRange(name: string, field: string, min: number, max: number): Row[] {
    const ds = this.datasets.get(name);
    if (!ds) return [];
    return ds.rows.filter((r) => {
      const v = r[field];
      return typeof v === "number" && v >= min && v <= max;
    });
  }

  sort(name: string, field: string, direction: "asc" | "desc" = "asc"): Row[] {
    const ds = this.datasets.get(name);
    if (!ds) return [];

    return [...ds.rows].sort((a, b) => {
      const x = a[field];
      const y = b[field];
      if (!x) return -1;
      if (!y) return 1;
      if (x < y) return direction === "asc" ? -1 : 1;
      if (x > y) return direction === "asc" ? 1 : -1;
      return 0;
    });
  }

  createIndex(dataset: string, field: string) {
    const ds = this.datasets.get(dataset);
    if (!ds) return;

    const index = new Map<any, Row[]>();
    for (const row of ds.rows) {
      const value = row[field];
      if (!index.has(value)) index.set(value, []);
      index.get(value)!.push(row);
    }

    if (!this.indexes.has(dataset)) this.indexes.set(dataset, new Map());
    this.indexes.get(dataset)!.set(field, index);
  }

  findIndexed(dataset: string, field: string, value: any): Row[] {
    const dsIndex = this.indexes.get(dataset);
    if (!dsIndex) return [];
    const fieldIndex = dsIndex.get(field);
    if (!fieldIndex) return [];
    return fieldIndex.get(value) || [];
  }

  join(
    left: string,
    right: string,
    leftKey: string,
    rightKey: string
  ): Array<{ left: Row; right: Row }> {
    const L = this.datasets.get(left);
    const R = this.datasets.get(right);
    if (!L || !R) return [];

    return L.rows.flatMap((l) => {
      const matches = R.rows.filter((r) => r[rightKey] === l[leftKey]);
      return matches.map((m) => ({ left: l, right: m }));
    });
  }
}
