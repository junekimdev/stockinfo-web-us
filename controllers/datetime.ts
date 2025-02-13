import * as gType from './data/types';
import { to2DigitString } from './number';

export const getDatetimeString = (date?: Date | gType.IDWeek) => {
  if (!date) return '';
  const { year, month, day, hour, minute, second } = stringfyDatetime(date);
  return `at ${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

export const getDatetimeStringForFilename = (date?: Date | gType.IDWeek) => {
  if (!date) return '';
  const { year, month, day, hour, minute, second } = stringfyDatetime(date);
  return `${year}${month}${day}_${hour}${minute}${second}`;
};

export const getTimestamp = (date: Date | gType.IDWeek) => {
  if (date instanceof Date) return date.getTime();
  return toDate(date).getTime();
};

const stringfyDatetime = (date: Date | gType.IDWeek) => {
  if (!(date instanceof Date)) date = toDate(date);
  const year = date.getFullYear().toString();
  const month = to2DigitString(date.getMonth() + 1);
  const day = to2DigitString(date.getDate());
  const hour = to2DigitString(date.getHours());
  const minute = to2DigitString(date.getMinutes());
  const second = to2DigitString(date.getSeconds());
  return { year, month, day, hour, minute, second };
};

const toDate = (date: gType.IDWeek) => {
  const d = new Date(date.year, 0, 1);
  d.setDate(d.getDate() + 7 * date.week);
  return d;
};
