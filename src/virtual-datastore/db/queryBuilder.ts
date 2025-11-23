import type { QuerySpec, WhereClause, AggregateFunction } from "./querySpec.js";
import type { Row } from "./types.js";
import { Database } from "./database.js";

export class QueryBuilder {
  private spec: QuerySpec;

  constructor(dataset: string) {
    this.spec = { dataset };
  }

  where(field: string, op: WhereClause["op"], value: any): this {
    this.spec.where = this.spec.where ?? [];
    this.spec.where.push({ field, op, value, logic: "AND" });
    return this;
  }

  like(field: string, pattern: string): this {
    return this.where(field, "LIKE", pattern);
  }

  in(field: string, values: any[]): this {
    return this.where(field, "IN", values);
  }

  whereRange(field: string, from: number, to: number): this {
    this.spec.ranges = this.spec.ranges ?? [];
    this.spec.ranges.push({ field, from, to });
    return this;
  }

  orderBy(field: string, direction: "asc" | "desc" = "asc"): this {
    this.spec.order = this.spec.order ?? [];
    this.spec.order.push({ field, direction });
    return this;
  }

  select(fields: string[]): this {
    this.spec.select = fields;
    return this;
  }

  aggregate(type: AggregateFunction["type"], field?: string): this {
    this.spec.aggregates = this.spec.aggregates ?? [];
    const agg = field
      ? ({ type, field } as AggregateFunction)
      : ({ type } as AggregateFunction);
    this.spec.aggregates.push(agg);
    return this;
  }

  limit(n: number): this {
    this.spec.limit = n;
    return this;
  }

  offset(n: number): this {
    this.spec.offset = n;
    return this;
  }

  toSpec(): QuerySpec {
    return { ...this.spec };
  }

  // runtime executor provided by Database
  async run(exec: Database) {
    return exec.execute(this.toSpec());
  }
}
