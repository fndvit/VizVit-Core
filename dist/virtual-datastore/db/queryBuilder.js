export class QueryBuilder {
    spec;
    constructor(dataset) {
        this.spec = { dataset };
    }
    where(field, op, value) {
        this.spec.where = this.spec.where ?? [];
        this.spec.where.push({ field, op, value, logic: "AND" });
        return this;
    }
    like(field, pattern) {
        return this.where(field, "LIKE", pattern);
    }
    in(field, values) {
        return this.where(field, "IN", values);
    }
    whereRange(field, from, to) {
        this.spec.ranges = this.spec.ranges ?? [];
        this.spec.ranges.push({ field, from, to });
        return this;
    }
    orderBy(field, direction = "asc") {
        this.spec.order = this.spec.order ?? [];
        this.spec.order.push({ field, direction });
        return this;
    }
    select(fields) {
        this.spec.select = fields;
        return this;
    }
    aggregate(type, field) {
        this.spec.aggregates = this.spec.aggregates ?? [];
        const agg = field
            ? { type, field }
            : { type };
        this.spec.aggregates.push(agg);
        return this;
    }
    limit(n) {
        this.spec.limit = n;
        return this;
    }
    offset(n) {
        this.spec.offset = n;
        return this;
    }
    toSpec() {
        return { ...this.spec };
    }
    // runtime executor provided by Database
    async run(exec) {
        return exec.execute(this.toSpec());
    }
}
//# sourceMappingURL=queryBuilder.js.map