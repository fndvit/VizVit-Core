import fs from "fs";
export function readCSV(filePath) {
    const content = fs.readFileSync(filePath, "utf-8");
    const lines = content.trim().split("\n");
    const headers = lines[0].split(",");
    const rows = lines.slice(1).map((line) => {
        const values = line.split(",");
        const row = {};
        headers.forEach((h, i) => (row[h] = values[i]));
        return row;
    });
    return rows;
}
//# sourceMappingURL=csvSource.js.map