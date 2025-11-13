import fs from "fs";
import path from "path";
import { readCSV } from "../sources/csvSource.ts";
export class Database {
    constructor(baseDir) {
        this.datasets = new Map();
        this.baseDir = baseDir;
    }
    /**
     * Loads all CSV files from the base directory into datasets
     */
    loadAll() {
        const files = fs
            .readdirSync(this.baseDir)
            .filter((f) => f.endsWith(".csv"));
        for (const file of files) {
            const fullPath = path.join(this.baseDir, file);
            const name = path.basename(file, ".csv");
            const rawRows = readCSV(fullPath);
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
            this.datasets.set(name, { name, rows });
        }
    }
    /**
     * Gets a dataset by name
     */
    get(name) {
        return this.datasets.get(name);
    }
    /**
     * Lists all loaded datasets
     */
    list() {
        return [...this.datasets.keys()];
    }
}
