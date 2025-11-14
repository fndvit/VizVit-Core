export declare function omitUndefined<T extends Record<string | number, unknown>>(obj: T): { [P in keyof T]?: T[P]; };
