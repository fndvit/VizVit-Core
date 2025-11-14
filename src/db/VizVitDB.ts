import fs from "fs";
import path from "path";
import type { Dataset, Row } from "../types/index.js";
import { readCSV } from "../sources/csvSource.js";

export class Database {
  private datasets: Map<string, Dataset> = new Map();
  private baseDir: string;

  constructor(baseDir: string) {
    this.baseDir = baseDir;
  }

  /**
   * Loads all CSV files from the base directory into datasets
   */
  loadAll(): void {
    const files = fs
      .readdirSync(this.baseDir)
      .filter((f) => f.endsWith(".csv"));

    for (const file of files) {
      const fullPath = path.join(this.baseDir, file);
      const name = path.basename(file, ".csv");
      const rawRows = readCSV(fullPath);

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

      this.datasets.set(name, { name, rows });
    }
  }

  /**
   * Gets a dataset by name
   */
  get(name: string): Dataset | undefined {
    return this.datasets.get(name);
  }

  /**
   * Lists all loaded datasets
   */
  list(): string[] {
    return [...this.datasets.keys()];
  }
}
