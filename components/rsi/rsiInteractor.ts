import { ChangeEvent, useCallback, useEffect } from 'react';
import { useRecoilState, useSetRecoilState } from 'recoil';
import { StateRsi, StateRsiDisplay } from '../../controllers/data/states';
import {
  TypePriceRequest,
  TypePriceVolumeValue,
  TypeRsi,
  TypeRsiDisplayItem,
} from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const useDisplayCheckboxChange = (what: TypeRsiDisplayItem) => {
  const setState = useSetRecoilState(StateRsiDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({ ...prev, [what]: e.currentTarget.checked }));
    },
    [what],
  );
};

export const useRsi = (
  req: TypePriceRequest,
  period = 14,
  over: TypePriceVolumeValue = 'close',
) => {
  const { data } = useGetPrices(req);
  const [dataRsi, setState] = useRecoilState(StateRsi(req));

  useEffect(() => {
    if (data && data.length && !dataRsi.length) {
      const result: TypeRsi[] = [];
      const changes = data.map((_v, i) => (i ? data[i][over] - data[i - 1][over] : 0));
      const genGain = generateGain(changes);
      const genLoss = generateLoss(changes);
      const prevAvgGain: number[] = [];
      const prevAvgLoss: number[] = [];

      for (let i = 0; i < data.length; i++) {
        const gain = genGain.next().value ?? 0;
        const loss = genLoss.next().value ?? 0;
        const avgGain = getAvg(gain, prevAvgGain, i, period);
        const avgLoss = getAvg(loss, prevAvgLoss, i, period);
        const rsi = getRSI(avgGain, avgLoss);

        prevAvgGain.push(avgGain);
        prevAvgLoss.push(avgLoss);

        const { date } = data[i];
        result.push({ date, rsi });
      }
      setState(result);
    }
  }, [period, over, data, dataRsi]);
};

// Generators
const generateGain = function* (changes: number[]) {
  for (const v of changes) yield v > 0 ? v : 0;
};
const generateLoss = function* (changes: number[]) {
  for (const v of changes) yield v < 0 ? v : 0;
};

// Wilder's Smoothing Techniques
const getAvg = (value: number, prev: number[], i: number, period: number) => {
  const preValue = i ? prev[i - 1] : 0;
  // First period is up to [period + 1] b/c value is based on changes
  if (i < period + 1) return preValue + value / period;
  return (value + preValue * (period - 1)) / period;
};

const getRSI = (avgGain: number, avgLoss: number) => {
  if (avgLoss === 0) return 100;
  const rs = avgGain / avgLoss;
  return 100 - 100 / (1 - rs);
};
