import { ChangeEvent, useCallback, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import {
  emaSnapshotStep,
  emaStep,
  getCurrentTR,
  getEMAFactorK,
  wilderSmoothEMA,
} from '../../controllers/avg';
import { StateMacdV, StateMacdVDisplay } from '../../controllers/data/states';
import {
  TypeMacdV,
  TypeMacdVDisplayItem,
  TypePriceRequest,
  TypePriceVolume,
  TypePriceVolumeValue,
} from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const useDisplayCheckboxChange = (what: TypeMacdVDisplayItem) => {
  const setState = useSetRecoilState(StateMacdVDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({ ...prev, [what]: e.currentTarget.checked }));
    },
    [what],
  );
};

export const useMacdV = (
  req: TypePriceRequest,
  options?: { period?: [number, number, number]; over?: TypePriceVolumeValue; smoothing?: number },
) => {
  const { period = [12, 26, 9], over = 'close', smoothing = 2 } = options ?? {};
  const [p1, p2, p3] = period;
  const { data } = useGetPrices(req);
  const [dataMacdV, setState] = useRecoilState(StateMacdV(req));

  useEffect(() => {
    if (data && data.length && !dataMacdV.length) {
      const f1 = (over: TypePriceVolumeValue) => (d: TypePriceVolume) => d[over];
      const f2 = (d: number) => d;
      const k1 = getEMAFactorK(p1, smoothing);
      const k2 = getEMAFactorK(p2, smoothing);
      const k3 = getEMAFactorK(p3, smoothing);
      const result: TypeMacdV[] = [];
      const prevShortEMA: number[] = [];
      const prevLongEMA: number[] = [];
      const prevAtr: number[] = [];
      const prevMacdV: number[] = [];

      for (let i = 0; i < data.length; i++) {
        const shortEMA = emaStep(data, prevShortEMA, p1, i, k1, f1(over), f2);
        const longEMA = emaStep(data, prevLongEMA, p2, i, k2, f1(over), f2);
        const atr = wilderSmoothEMA(getCurrentTR(data, i), prevAtr, i, p2);
        const macdV = ((shortEMA - longEMA) / atr) * 100;
        const signal = emaSnapshotStep(macdV, prevMacdV, p3, i, k3);
        const histogram = (macdV - signal) * 2;

        prevShortEMA.push(shortEMA);
        prevLongEMA.push(longEMA);
        prevAtr.push(atr);
        prevMacdV.push(macdV);

        const { date } = data[i];
        result.push({ date, macdV, signal, histogram });
      }
      setState(result);
    }
  }, [p1, p2, p3, over, smoothing, data, dataMacdV]);
};
