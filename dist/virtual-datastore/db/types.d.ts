export type Primitive = string | number | boolean | null;
export type Row = Record<string, Primitive>;
export interface Dataset {
    name: string;
    rows: Row[];
    columns?: Record<string, Primitive[]>;
}
