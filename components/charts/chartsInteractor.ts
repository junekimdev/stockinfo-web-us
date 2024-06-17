import { MouseEvent, useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getPriceEMA } from '../../controllers/avg';
import {
  StatePriceBollingerBands,
  StatePriceHeikinAshi,
  StatePriceHeikinAshiSmoothed,
  StatePriceSAR,
} from '../../controllers/data/states';
import {
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

export const useHeikinAshi = (req: TypePriceRequest) => {
  const { data } = useGetPrices(req);
  const [dataHeikinAshi, setState] = useRecoilState(StatePriceHeikinAshi(req));

  useEffect(() => {
    if (data && data.length && !dataHeikinAshi.length) {
      const bar: TypePrice[] = data.map((v) => ({
        date: v.date,
        open: 0,
        close: (v.open + v.close + v.high + v.low) / 4,
        high: Math.max(v.open, v.close, v.high),
        low: Math.min(v.open, v.close, v.low),
      }));

      for (let i = 0; i < bar.length; i++) {
        bar[i].open = i ? (bar[i - 1].open + bar[i - 1].close) / 2 : bar[i].close;
      }

      setState(bar);
    }
  }, [data, dataHeikinAshi]);
};

export const useHeikinAshiSmoothed = (req: TypePriceRequest, p1 = 10, p2 = 10) => {
  const data = useRecoilValue(StatePriceHeikinAshi(req));
  const [dataHeikinAshiSmoothed, setState] = useRecoilState(StatePriceHeikinAshiSmoothed(req));

  useEffect(() => {
    if (data && data.length > 1 && !dataHeikinAshiSmoothed.length) {
      const smoothed = getPriceEMA(getPriceEMA(data, p1), p2);
      if (smoothed) setState(smoothed);
    }
  }, [data, dataHeikinAshiSmoothed]);
};

export const useBollinger = (req: TypePriceRequest, period = 20, sigma = 2) => {
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

export const useSAR = (req: TypePriceRequest, max = 0.2, step = 0.01) => {
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
