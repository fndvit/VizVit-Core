export type Primitive = string | number | boolean | null;
export type Row = Record<string, Primitive>;

export interface Dataset<> {
  name: string;
  rows: Row[];
  columns?: Record<string, Primitive[]>;
}

// export interface Dataset<RowType extends Record<string, Primitive>> {
//   name: string;
//   rows: RowType[];
//   indexBy?: keyof RowType;
//   index?: Map<RowType[keyof RowType], RowType>;
// }
