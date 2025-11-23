/**
 * Simple generator that creates TypeScript interfaces from registered schemas.
 * Usage: node -r ts-node/register scripts/generateTypes.ts
 */
import { Database } from "./database.js";
async function run() {
    const db = new Database();
    // example: register a schema and generate
    // db.registerSchema('paises', { id: 'number', nombre: 'string' });
    // generate from db.schemas (not exposed publicly in this small example)
    console.log("invoke generateTypes in your code where you have schemas registered");
}
if (require.main === module)
    run().catch(console.error);
//# sourceMappingURL=generateTypes.js.map