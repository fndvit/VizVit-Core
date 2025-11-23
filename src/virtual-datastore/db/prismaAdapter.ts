import type { Database } from "./database.js";
import type { PrismaClient } from "@prisma/client";

export async function loadFromPrisma(
  client: PrismaClient,
  modelName: string,
  db: Database
) {
  // modelName should match Prisma model with findMany
  const rows = await (client as any)[modelName].findMany();
  const datasetName = modelName.toLowerCase();
  db.__internal_setDataset(datasetName, { name: datasetName, rows });
}

export async function persistToPrisma(
  client: PrismaClient,
  modelName: string,
  db: Database
) {
  const datasetName = modelName.toLowerCase();
  const ds = db.get(datasetName);
  if (!ds) return;
  // naive: upsert each row (requires id presence)
  for (const r of ds.rows) {
    const id = (r as any).id;
    if (id == null) {
      await (client as any)[modelName].create({ data: r });
    } else {
      await (client as any)[modelName].upsert({
        where: { id },
        create: r,
        update: r,
      });
    }
  }
}
