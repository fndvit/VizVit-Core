export class TransactionManager {
    ops = [];
    active = false;
    begin() {
        this.ops = [];
        this.active = true;
    }
    isActive() {
        return this.active;
    }
    add(op) {
        if (!this.active)
            throw new Error("No active transaction");
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
//# sourceMappingURL=transaction.js.map