import { MouseEvent, useCallback, useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { emaSnapshotStep, getEMAFactorK } from '../../controllers/avg';
import {
  StateChaikin,
  StatePriceBollingerBands,
  StatePriceSAR,
} from '../../controllers/data/states';
import {
  TypeChaikin,
  TypeParabolicSAR,
  TypePrice,
  TypePriceBollingerBands,
  TypePriceRequest,
} from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './charts.module.scss';

export const useRulerOnClick = () => {
  return useCallback((e: MouseEvent<HTMLElement>) => {
    const parent = e.currentTarget.parentElement;
    const ruler = document.querySelector<HTMLElement>(`.${styles.ruler}`);
    if (ruler && parent) {
      const x = Math.round(e.clientX - parent.offsetLeft + e.currentTarget.scrollLeft);
      ruler.style.left = `${x}px`;
      ruler.style.height = `${e.currentTarget.scrollHeight}px`;
    }
  }, []);
};

export const useBollinger = (
  req: TypePriceRequest,
  options?: { period?: number; sigma?: number },
) => {
  const { period = 20, sigma = 2 } = options ?? {};
  const { data } = useGetPrices(req);
  const [dataBollingerBands, setState] = useRecoilState(StatePriceBollingerBands(req));

  useEffect(() => {
    if (data && data.length && !dataBollingerBands.length) {
      if (data.length < period) {
        console.error('Unable to create SMA');
        return;
      }

      // Create Bollinger Bands
      const bands: TypePriceBollingerBands[] = [];
      for (let i = period - 1; i < data.length; i++) {
        const slice = data.slice(i + 1 - period, i + 1);
        const sum = slice.reduce((p, v) => p + v.close, 0);
        const avg = sum / period;
        const variance = slice.reduce((p, v) => {
          const diff = v.close - avg;
          return p + diff * diff; // Sum of squres
        }, 0);
        const stdv = Math.sqrt(variance / period);
        bands.push({
          date: data[i].date,
          middle: avg,
          upper: avg + stdv * 2,
          lower: avg - stdv * 2,
        });
      }
      setState(bands);
    }
  }, [data, dataBollingerBands, period, sigma]);
};

export const useSAR = (req: TypePriceRequest, options?: { max?: number; step?: number }) => {
  const { max = 0.2, step = 0.01 } = options ?? {};
  const { data } = useGetPrices(req);
  const [dataSAR, setState] = useRecoilState(StatePriceSAR(req));

  useEffect(() => {
    if (data && data.length && !dataSAR.length) {
      const result: TypeParabolicSAR[] = [];
      let isUpTrend = false;
      let foundNewEP = false;
      let ep = 0;
      let af = 0;

      for (let i = 0; i < data.length; i++) {
        let thisSAR: number;
        if (i === 0) {
          thisSAR = data[i].low;
        } else if (i === 1) {
          isUpTrend = data[i - 1].close <= data[i].close;
          thisSAR = isUpTrend ? data[i].low : data[i].high;
          ep = isUpTrend ? data[i].high : data[i].low;
          af = step;
        } else {
          const { newEp, found } = nextEP(data[i], ep, isUpTrend);
          ep = newEp;
          foundNewEP = found;
          if (foundNewEP) af = nextAF(af, step, max);
          thisSAR = nextSAR(result[i - 1].sar, ep, af);
          if (detectCollision(data[i], thisSAR, isUpTrend)) {
            // Start new trend
            isUpTrend = !isUpTrend;
            thisSAR = ep;
            ep = isUpTrend ? data[i].high : data[i].low;
            af = step;
          } else if (detectCollision(data[i - 1], thisSAR, isUpTrend)) {
            thisSAR = isUpTrend ? data[i - 1].low : data[i - 1].high;
          } else if (detectCollision(data[i - 2], thisSAR, isUpTrend)) {
            thisSAR = isUpTrend ? data[i - 2].low : data[i - 2].high;
          }
        }
        result.push({ date: data[i].date, sar: thisSAR, isUpTrend });
      }
      setState(result);
    }
  }, [data, dataSAR, max, step]);
};

const nextEP = (price: TypePrice, prevEP: number, isUpTrend: boolean) => {
  const found = true;
  if (isUpTrend) {
    if (price.high > prevEP) return { newEp: price.high, found };
  } else {
    if (price.low < prevEP) return { newEp: price.low, found };
  }
  return { newEp: prevEP, found: !found };
};

const nextAF = (prevAF: number, step: number, max: number) => {
  const af = prevAF + step;
  return af > max ? max : af;
};

const nextSAR = (prevSAR: number, ep: number, af: number) => prevSAR + af * (ep - prevSAR);

const detectCollision = (price: TypePrice, sar: number, isUpTrend: boolean) =>
  isUpTrend ? sar >= price.low : sar <= price.high;

export const useChaikin = (req: TypePriceRequest, period = [3, 10, 20]) => {
  const [p1, p2, p3] = period;
  const { data } = useGetPrices(req);
  const [dataChainkin, setState] = useRecoilState(StateChaikin(req));

  useEffect(() => {
    if (data && data.length && !dataChainkin.length) {
      const k1 = getEMAFactorK(p1);
      const k2 = getEMAFactorK(p2);
      const result: TypeChaikin[] = [];
      const prevADL: number[] = [];
      const prevADL1: number[] = [];
      const prevADL2: number[] = [];
      const prevMFV: number[] = [];

      for (let i = 0; i < data.length; i++) {
        const { high, low, close, volume } = data[i];
        const moneyFlowMultiple = (close - low - (high - close)) / (high - low);
        const moneyFlowVolume = moneyFlowMultiple * volume;
        const adl = (i ? prevADL[i - 1] : 0) + moneyFlowVolume;
        const adl1 = emaSnapshotStep(adl, prevADL1, p1, i, k1);
        const adl2 = emaSnapshotStep(adl, prevADL2, p2, i, k2);
        const co = adl1 - adl2;

        prevMFV.push(moneyFlowVolume);
        const cmf = slidingSum(prevMFV, p3, i, (d) => d) / slidingSum(data, p3, i, (d) => d.volume);

        prevADL.push(adl);
        prevADL1.push(adl1);
        prevADL2.push(adl2);

        const { date } = data[i];
        result.push({ date, co, cmf });
      }
      setState(result);
    }
  }, [p1, p2, p3, data, dataChainkin]);
};

const slidingSum = <T>(data: T[], period: number, i: number, func: (_d: T) => number) => {
  if (i === 0) return func(data[i]);
  if (i < period) return data.slice(0, i + 1).reduce((p, v) => p + func(v), 0);
  return data.slice(i + 1 - period, i + 1).reduce((p, v) => p + func(v), 0);
};
