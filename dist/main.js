const array = [
    { a: 1, b: 2 },
    { a: 3, b: 4 },
];
import { createLookupFromArrayOfObjects } from "./utils/createLookup.js";
const lookup = createLookupFromArrayOfObjects(array, (item) => item.a, (item) => item.b);
console.log(lookup);
//# sourceMappingURL=main.js.map