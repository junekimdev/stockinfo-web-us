import { useAtom } from 'jotai';
import { useEffect } from 'react';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const useRsi = (
  req: gType.PriceRequest,
  period = 14,
  over: gType.PriceVolumeValue = 'close',
) => {
  const { data } = useGetPrices(req);
  const [dataRsi, setState] = useAtom(gState.rsi(req));

  useEffect(() => {
    if (data && data.length && !dataRsi.length) {
      const result: gType.Rsi[] = [];
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
  }, [setState, period, over, data, dataRsi]);
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
