import { TypeAvgValue, TypeMovingAvg, TypePrice } from './data/types';

export const simpleMA = (
  data: TypePrice[] | undefined,
  period: number,
  over: TypeAvgValue = 'close',
) => {
  const r: TypeMovingAvg[] = [];
  if (data && data.length >= period) {
    for (let i = period - 1; i < data.length; i++) {
      const { date } = data[i];
      const slice = data.slice(i + 1 - period, i + 1);
      const sum = slice.reduce((p, v) => p + v[over], 0);
      const avg = sum / period;
      r.push({ date, avg });
    }
  } else {
    console.error('Unable to create SMA');
  }
  return r;
};

export const ExpMA = (
  data: TypePrice[] | undefined,
  period: number,
  over: TypeAvgValue = 'close',
  smoothing = 2,
) => {
  const r: TypeMovingAvg[] = [];
  if (data && data.length > 1) {
    const k = smoothing / (period + 1);
    for (let i = 0; i < data.length; i++) {
      const { date } = data[i];
      const avg = i ? data[i][over] * k + r[i - 1].avg * (1 - k) : data[i][over];
      r.push({ date, avg });
    }
  } else {
    console.error('Unable to create EMA');
  }
  return r;
};

export const getPriceEMA = (data: TypePrice[] | undefined, period: number, smoothing = 2) => {
  const r: TypePrice[] = [];
  if (data && data.length > 1) {
    const k = smoothing / (period + 1);
    for (let i = 0; i < data.length; i++) {
      if (i) {
        const date = data[i].date;
        const open = data[i].open * k + r[i - 1].open * (1 - k);
        const close = data[i].close * k + r[i - 1].close * (1 - k);
        const high = data[i].high * k + r[i - 1].high * (1 - k);
        const low = data[i].low * k + r[i - 1].low * (1 - k);
        r.push({ date, open, close, high, low });
      } else {
        r.push({ ...data[i] });
      }
    }
  } else {
    console.error('Unable to create PriceEMA');
  }
  return r;
};
