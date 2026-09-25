// backend/src/utils/pagination.ts
export const paginate = (query: any, page = 1, size = 50) => {
  const limit = size;
  const offset = (page - 1) * size;
  return query.limit(limit).offset(offset);
};
