import type { QuerySpec, WhereClause, AggregateFunction } from "./querySpec.js";
import type { Row } from "./types.js";
import { Database } from "./database.js";
export declare class QueryBuilder {
    private spec;
    constructor(dataset: string);
    where(field: string, op: WhereClause["op"], value: any): this;
    like(field: string, pattern: string): this;
    in(field: string, values: any[]): this;
    whereRange(field: string, from: number, to: number): this;
    orderBy(field: string, direction?: "asc" | "desc"): this;
    select(fields: string[]): this;
    aggregate(type: AggregateFunction["type"], field?: string): this;
    limit(n: number): this;
    offset(n: number): this;
    toSpec(): QuerySpec;
    run(exec: Database): Promise<{
        rows: Row[];
        meta: Record<string, any>;
    }>;
}
