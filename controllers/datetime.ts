import { TypeIDWeek } from './data/types';

export const getTimestamp = (date: Date | TypeIDWeek) => {
  if (date instanceof Date) return date.getTime();
  return toDate(date).getTime();
};

const toDate = (date: TypeIDWeek) => {
  const d = new Date(date.year, 0, 1);
  d.setDate(d.getDate() + 7 * date.week);
  return d;
};
