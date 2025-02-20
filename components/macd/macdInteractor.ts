import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { emaSnapshotStep, emaStep, getEMAFactorK } from '../../controllers/avg';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const useMacd = (
  req: gType.PriceRequest,
  options?: {
    period?: [number, number, number];
    over?: gType.PriceVolumeItem;
    smoothing?: number;
  },
) => {
  const { period = [12, 26, 9], over = 'close', smoothing = 2 } = options ?? {};
  const [p1, p2, p3] = period;
  const { data } = useGetPrices(req);
  const [dataMacd, setState] = useAtom(gState.macd(req));

  useEffect(() => {
    if (data && data.length && !dataMacd.length) {
      const f1 = (over: gType.PriceVolumeItem) => (d: gType.PriceVolume) => d[over];
      const f2 = (d: number) => d;
      const k1 = getEMAFactorK(p1, smoothing);
      const k2 = getEMAFactorK(p2, smoothing);
      const k3 = getEMAFactorK(p3, smoothing);
      const result: gType.Macd[] = [];
      const prevShortEMA: number[] = [];
      const prevLongEMA: number[] = [];
      const prevMacd: number[] = [];

      for (let i = 0; i < data.length; i++) {
        const shortEMA = emaStep(data, prevShortEMA, p1, i, k1, f1(over), f2);
        const longEMA = emaStep(data, prevLongEMA, p2, i, k2, f1(over), f2);
        const macd = shortEMA - longEMA;
        const signal = emaSnapshotStep(macd, prevMacd, p3, i, k3);
        const histogram = (macd - signal) * 2;

        prevShortEMA.push(shortEMA);
        prevLongEMA.push(longEMA);
        prevMacd.push(macd);

        const { date } = data[i];
        result.push({ date, macd, signal, histogram });
      }
      setState(result);
    }
  }, [setState, p1, p2, p3, over, smoothing, data, dataMacd]);
};
