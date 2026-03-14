export const normalizeDate = (date: string | Date) => {
  if (date instanceof Date) {
    return date;
  }
  if (typeof date === 'string') {
    return new Date(date).toISOString();
  }
  return new Date().toISOString();
};
