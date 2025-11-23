export async function loadFromPrisma(client, modelName, db) {
    // modelName should match Prisma model with findMany
    const rows = await client[modelName].findMany();
    const datasetName = modelName.toLowerCase();
    db.__internal_setDataset(datasetName, { name: datasetName, rows });
}
export async function persistToPrisma(client, modelName, db) {
    const datasetName = modelName.toLowerCase();
    const ds = db.get(datasetName);
    if (!ds)
        return;
    // naive: upsert each row (requires id presence)
    for (const r of ds.rows) {
        const id = r.id;
        if (id == null) {
            await client[modelName].create({ data: r });
        }
        else {
            await client[modelName].upsert({
                where: { id },
                create: r,
                update: r,
            });
        }
    }
}
//# sourceMappingURL=prismaAdapter.js.map