import type { Dataset } from "../types/index.js";
export interface BarChartItem {
    label: string;
    value: number;
}
export declare function datasetToBarChart(dataset: Dataset, labelColumn: string, valueColumn: string): BarChartItem[];
