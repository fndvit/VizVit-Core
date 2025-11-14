import { readCSVFromURL } from "../sources/csvSource.js";
export class Database {
    datasets = new Map();
    constructor() { }
    async loadAll(urls) {
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
                // Usa el nombre del archivo sin extensión como key
                const name = url
                    .split("/")
                    .pop()
                    ?.replace(/\.csv$/, "") || url;
                this.datasets.set(name, { name, rows });
            }
            catch (err) {
                console.error(`Error cargando CSV desde ${url}`, err);
            }
        }
    }
    get(name) {
        return this.datasets.get(name);
    }
    list() {
        return [...this.datasets.keys()];
    }
}
//# sourceMappingURL=VizVitDB.js.map