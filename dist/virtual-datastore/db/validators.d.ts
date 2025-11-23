import type { Schema } from "./schema.js";
import type { Row } from "./types.js";
import { z } from "zod";
export declare function zodFromSchema(schema: Schema): z.ZodObject<{
    [x: string]: any;
}, z.core.$strip>;
export declare function validateRowWithZod(row: Row, zodSchema: z.ZodTypeAny): z.ZodSafeParseResult<unknown>;
