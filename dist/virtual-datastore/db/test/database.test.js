import assert from "assert";
import { Database } from "../database.js";
async function main() {
    const csv = `id,nombre,region,year,pib\n1,Finland,EU,2010,200\n2,Ireland,EU,2015,300\n3,Thailand,AS,2018,150`;
    const db = new Database();
    await db.loadFromCsvText("paises", csv);
    const qb = db.query("paises");
    const rows = await qb
        .where("region", "=", "EU")
        .whereRange("year", 2000, 2020)
        .orderBy("pib", "desc")
        .limit(10)
        .run(db);
    assert(Array.isArray(rows), "rows should be array");
    assert(rows.length === 2, `expected 2 rows got ${rows.length}`);
    console.log("Basic query OK");
    // LIKE
    const r2 = await db.query("paises").like("nombre", "%land%").run(db);
    assert(r2.rows.length === 1 && r2.rows[0].nombre === "Finland");
    console.log("LIKE OK");
    // IN
    const r3 = await db.query("paises").in("id", [1, 3]).run(db);
    assert(r3.rows.length === 2);
    console.log("IN OK");
    // aggregates
    const res = await db
        .query("paises")
        .aggregate("avg", "pib")
        .aggregate("count")
        .run(db);
    assert(res[0]._aggregates.count === 3);
    console.log("Aggregates OK", res[0]._aggregates);
    // transactions
    db.beginTransaction();
    db.txInsert("paises", {
        id: 4,
        nombre: "New",
        region: "EU",
        year: 2022,
        pib: 50,
    });
    db.commitTransaction();
    const all = await db.query("paises").run(db);
    assert(all.rows.length === 4);
    console.log("Transactions OK");
    console.log("ALL TESTS PASSED");
}
main().catch((e) => {
    console.error(e);
    process.exit(1);
});
//# sourceMappingURL=database.test.js.map