import { Database } from "./db/VizVitDB.ts";
const db = new Database("./data");
db.loadAll();
console.log(db.list()); // ['products', 'stores', 'sales', ...]
console.log(db.get("sales")?.rows.slice(0, 3));
