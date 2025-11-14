import type { Dataset } from "../types/index.ts";
export interface BarChartItem {
    label: string;
    value: number;
}
export declare function datasetToBarChart(dataset: Dataset, labelColumn: string, valueColumn: string): BarChartItem[];
