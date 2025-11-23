import type { Database } from "./database.js";
import type { PrismaClient } from "@prisma/client";
export declare function loadFromPrisma(client: PrismaClient, modelName: string, db: Database): Promise<void>;
export declare function persistToPrisma(client: PrismaClient, modelName: string, db: Database): Promise<void>;
