import { Database } from "./db/VizVitDB.ts";
import { datasetToBarChart } from "./bridge/barchartBridge.ts";
const db = new Database("./data");
db.loadAll();
const salesDataset = db.get("sales");
if (!salesDataset) {
    console.log("Dataset 'sales' not found.");
}
else {
    const barChartData = datasetToBarChart(salesDataset, "name", "sales");
    console.log("prepared bar chart data:", barChartData);
}
//# sourceMappingURL=main.js.map