import { z } from "zod";
// Small helper: transform our simple Schema to Zod schema
export function zodFromSchema(schema) {
    const obj = {};
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
export function validateRowWithZod(row, zodSchema) {
    return zodSchema.safeParse(row);
}
//# sourceMappingURL=validators.js.map