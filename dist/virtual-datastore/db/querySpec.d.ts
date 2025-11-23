export type ComparisonOperator = "=" | "!=" | ">" | ">=" | "<" | "<=" | "IN" | "LIKE";
export type LogicalOperator = "AND" | "OR";
export interface WhereClause {
    field: string;
    op: ComparisonOperator;
    value: any;
    logic?: LogicalOperator;
}
export interface RangeClause {
    field: string;
    from: number;
    to: number;
}
export interface OrderClause {
    field: string;
    direction: "asc" | "desc";
}
export type AggregateFunction = {
    type: "sum";
    field: string;
} | {
    type: "avg";
    field: string;
} | {
    type: "min";
    field: string;
} | {
    type: "max";
    field: string;
} | {
    type: "count";
    field?: string;
};
export interface QuerySpec {
    dataset: string;
    where?: WhereClause[];
    ranges?: RangeClause[];
    order?: OrderClause[];
    limit?: number;
    offset?: number;
    select?: string[];
    aggregates?: AggregateFunction[];
}
