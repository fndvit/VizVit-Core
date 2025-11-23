import type { Schema } from "./schema.js";
import type { Row } from "./types.js";
import { z } from "zod";

// Small helper: transform our simple Schema to Zod schema
export function zodFromSchema(schema: Schema) {
  const obj: Record<string, any> = {};
  for (const [k, t] of Object.entries(schema)) {
    switch (t) {
      case "number":
        obj[k] = z.number().optional();
        break;
      case "boolean":
        obj[k] = z.boolean().optional();
        break;
      case "string":
        obj[k] = z.string().optional();
        break;
      default:
        obj[k] = z.any().optional();
    }
  }
  return z.object(obj);
}

export function validateRowWithZod(row: Row, zodSchema: z.ZodTypeAny) {
  return zodSchema.safeParse(row);
}
