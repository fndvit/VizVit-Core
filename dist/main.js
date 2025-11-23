// Cargar datasets CSV
import { Database } from "./virtual-datastore/db/database.js";
async function example() {
    //Calculate time taken
    console.time("example");
    const db = new Database();
    // Good for development and testing, if the dataset provided is not as expected it will throw errors
    const paisesSchema = {
        id: "number",
        nombre: "string",
        region: "string",
        year: "number",
        pib: "number",
    };
    db.registerSchema("paises", paisesSchema);
    //TODO: Add the option to register schema when loading the dataset
    //TODO: Add the option to choose the schema name loading the dataset
    await db.loadAll(["http://localhost:3000/src/virtual-datastore/data/test.csv"], {
        validate: true,
    });
    const dataset = db.get("test");
    console.log(`Dataset 'test' loaded with ${dataset?.rows.length} rows.`);
    // Prepare the query, in this case we want to get the top 5 countries in Europe by GDP between 2000 and 2020
    // Show time taken
    console.timeEnd("example");
    console.time("example");
    db.addDataset("paises", dataset);
    console.timeEnd("example");
}
example();
//# sourceMappingURL=main.js.map