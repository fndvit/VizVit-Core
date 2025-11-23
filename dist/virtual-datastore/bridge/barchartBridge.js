export function datasetToBarChart(dataset, labelColumn, valueColumn) {
    return dataset.rows
        .map((row) => {
        const label = row[labelColumn];
        const value = row[valueColumn];
        console.log("Row:", row, "Label:", label, "Value:", value);
        // Filtramos filas que no tengan datos válidos
        if (typeof label !== "string" ||
            (typeof value !== "number" && typeof value !== "string")) {
            return null;
        }
        return {
            label,
            value: typeof value === "string" ? parseFloat(value) : value,
        };
    })
        .filter((item) => item !== null);
}
//# sourceMappingURL=barchartBridge.js.map