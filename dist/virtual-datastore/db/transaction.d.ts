import type { Row } from "./types.js";
export type TxOp = {
    op: "insert";
    dataset: string;
    row: Row;
} | {
    op: "update";
    dataset: string;
    predicate: (r: Row) => boolean;
    patch: Partial<Row>;
} | {
    op: "delete";
    dataset: string;
    predicate: (r: Row) => boolean;
};
export declare class TransactionManager {
    private ops;
    private active;
    begin(): void;
    isActive(): boolean;
    add(op: TxOp): void;
    getOps(): TxOp[];
    clear(): void;
}
