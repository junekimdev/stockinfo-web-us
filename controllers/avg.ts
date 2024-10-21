import {
  TypeMovingAvg,
  TypePrice,
  TypePriceValue,
  TypePriceVolume,
  TypePriceVolumeValue,
} from './data/types';

export const getEMAFactorK = (period: number, smoothing = 2) => smoothing / (period + 1);

export const smaSnapshotStep = (data: number, prev: number[], i: number) => {
  if (i === 0) return data;
  return (data + prev[i - 1] * i) / (i + 1);
};

export const emaSnapshotStep = (
  data: number,
  prev: number[],
  period: number,
  i: number,
  k: number,
) => {
  if (i < period) return smaSnapshotStep(data, prev, i);
  return data * k + prev[i - 1] * (1 - k);
};

export const smaStep = <T>(data: T[], period: number, i: number, func: (_d: T) => number) => {
  if (i === 0) return func(data[i]);
  if (i < period) return data.slice(0, i + 1).reduce((p, v) => p + func(v), 0) / (i + 1);
  return data.slice(i + 1 - period, i + 1).reduce((p, v) => p + func(v), 0) / period;
};

export const emaStep = <T, P>(
  data: T[],
  prev: P[],
  period: number,
  i: number,
  k: number,
  funcT: (_d: T) => number,
  funcP: (_d: P) => number,
) => {
  if (i < period) return smaStep(data, period, i, funcT);
  return funcT(data[i]) * k + funcP(prev[i - 1]) * (1 - k);
};

export const getPriceSMA = (
  data: TypePriceVolume[] | undefined,
  period: number,
  options?: { over?: TypePriceVolumeValue },
) => {
  const { over = 'close' } = options ?? {};
  const func = (over: TypePriceVolumeValue) => (d: TypePriceVolume) => d[over];
  const result: TypeMovingAvg[] = [];

  if (data && data.length >= period) {
    for (let i = 0; i < data.length; i++) {
      const { date } = data[i];
      const avg = smaStep(data, period, i, func(over));
      result.push({ date, avg });
    }
  }
  return result;
};

export const getPriceEMA = (
  data: TypePriceVolume[] | undefined,
  period: number,
  options?: { over?: TypePriceVolumeValue; smoothing?: number },
) => {
  const { over = 'close', smoothing = 2 } = options ?? {};
  const result: TypeMovingAvg[] = [];

  if (data && data.length > 1) {
    const f1 = (over: TypePriceVolumeValue) => (d: TypePriceVolume) => d[over];
    const f2 = (d: TypeMovingAvg) => d.avg;
    const k = getEMAFactorK(period, smoothing);

    for (let i = 0; i < data.length; i++) {
      const avg = emaStep(data, result, period, i, k, f1(over), f2);
      const { date } = data[i];
      result.push({ date, avg });
    }
  }
  return result;
};

export const getPriceEMAOverAll = (
  data: TypePrice[] | undefined,
  period: number,
  options?: { smoothing?: number },
) => {
  const { smoothing = 2 } = options ?? {};
  const result: TypePrice[] = [];

  if (data && data.length > 0) {
    const func = (over: TypePriceValue) => (d: TypePrice) => d[over];
    const k = getEMAFactorK(period, smoothing);

    for (let i = 0; i < data.length; i++) {
      const open = emaStep(data, result, period, i, k, func('open'), func('open'));
      const close = emaStep(data, result, period, i, k, func('close'), func('close'));
      const high = emaStep(data, result, period, i, k, func('high'), func('high'));
      const low = emaStep(data, result, period, i, k, func('low'), func('low'));
      const date = data[i].date;
      result.push({ date, open, close, high, low });
    }
  }
  return result;
};

// https://chartschool.stockcharts.com/table-of-contents/technical-indicators-and-overlays/technical-indicators/average-directional-index-adx#wilder_s_smoothing_techniques

// Wilder's Smoothing Techniques for TR and DMs
export const wilderSmooth = (value: number, prev: number[], i: number, period: number) => {
  const preValue = i ? prev[i - 1] : 0;
  if (i < period) return preValue + value;
  return preValue - preValue / period + value;
};

// Wilder's Smoothing Techniques for DX
export const wilderSmoothEMA = (value: number, prev: number[], i: number, period: number) => {
  const preValue = i ? prev[i - 1] : 0;
  if (i < period) return (preValue * i + value) / (i + 1);
  return (preValue * (period - 1) + value) / period;
};

// Get True Range(TR)
export const getCurrentTR = (data: TypePrice[], i: number) => {
  const { high, low } = data[i];
  if (i === 0) return high - low;
  const { close: prevClose } = data[i - 1];
  return Math.max(high - low, Math.abs(high - prevClose), Math.abs(prevClose - low));
};
