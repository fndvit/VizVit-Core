import type { Row } from "./types.js";

export type TxOp =
  | { op: "insert"; dataset: string; row: Row }
  | {
      op: "update";
      dataset: string;
      predicate: (r: Row) => boolean;
      patch: Partial<Row>;
    }
  | { op: "delete"; dataset: string; predicate: (r: Row) => boolean };

export class TransactionManager {
  private ops: TxOp[] = [];
  private active = false;

  begin() {
    this.ops = [];
    this.active = true;
  }
  isActive() {
    return this.active;
  }
  add(op: TxOp) {
    if (!this.active) throw new Error("No active transaction");
    this.ops.push(op);
  }
  getOps() {
    return this.ops.slice();
  }
  clear() {
    this.ops = [];
    this.active = false;
  }
}
