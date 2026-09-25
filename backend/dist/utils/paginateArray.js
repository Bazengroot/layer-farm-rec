"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginateArray = void 0;
// backend/src/utils/paginateArray.ts
const paginateArray = (items, page = 1, size = 50) => {
    const start = (page - 1) * size;
    return items.slice(start, start + size);
};
exports.paginateArray = paginateArray;
//# sourceMappingURL=paginateArray.js.map