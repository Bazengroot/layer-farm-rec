// backend/src/utils/paginateArray.ts
export const paginateArray = <T>(items: T[], page = 1, size = 50): T[] => {
  const start = (page - 1) * size;
  return items.slice(start, start + size);
};
