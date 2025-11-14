// src/bridge/barchartBridge.ts
import type { Dataset, Row } from "../types/index.js";

export interface BarChartItem {
  label: string;
  value: number;
}

export function datasetToBarChart(
  dataset: Dataset,
  labelColumn: string,
  valueColumn: string
): BarChartItem[] {
  return dataset.rows
    .map((row: Row) => {
      const label = row[labelColumn];
      const value = row[valueColumn];
      console.log("Row:", row, "Label:", label, "Value:", value);
      // Filtramos filas que no tengan datos válidos
      if (
        typeof label !== "string" ||
        (typeof value !== "number" && typeof value !== "string")
      ) {
        return null;
      }

      return {
        label,
        value: typeof value === "string" ? parseFloat(value) : value,
      };
    })
    .filter((item): item is BarChartItem => item !== null);
}
