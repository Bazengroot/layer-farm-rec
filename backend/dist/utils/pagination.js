"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paginate = void 0;
// backend/src/utils/pagination.ts
const paginate = (query, page = 1, size = 50) => {
    const limit = size;
    const offset = (page - 1) * size;
    return query.limit(limit).offset(offset);
};
exports.paginate = paginate;
//# sourceMappingURL=pagination.js.map