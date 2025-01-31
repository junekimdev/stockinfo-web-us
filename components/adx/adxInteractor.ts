import { useAtom } from 'jotai';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { getCurrentTR, wilderSmooth, wilderSmoothEMA } from '../../controllers/avg';
import { StateAdx } from '../../controllers/data/states';
import { TypeAdx, TypePrice, TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import { AdxStateDisplay } from './adxState';
import { AdxTypeDisplayItem } from './adxType';

export const useDisplayCheckboxChange = (what: AdxTypeDisplayItem) => {
  const [display, setState] = useAtom(AdxStateDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState({ ...display, [what]: e.currentTarget.checked });
    },
    [setState, display, what],
  );
};

export const useAdx = (req: TypePriceRequest, period = 14) => {
  const { data } = useGetPrices(req);
  const [dataAdx, setState] = useAtom(StateAdx(req));

  useEffect(() => {
    if (data && data.length && !dataAdx.length) {
      const result: TypeAdx[] = [];
      const prevSmoothedTR: number[] = [];
      const prevSmoothedPDM: number[] = [];
      const prevSmoothedNDM: number[] = [];
      const prevSmoothedDX: number[] = [];

      for (let i = 0; i < data.length; i++) {
        // Get TR, DMs
        const tr = getCurrentTR(data, i);
        const { positiveDM, negativeDM } = getDMs(data, i);

        // Smooth TR, DMs
        const avgTR = wilderSmooth(tr, prevSmoothedTR, i, period);
        const avgPosDM = wilderSmooth(positiveDM, prevSmoothedPDM, i, period);
        const avgNegDM = wilderSmooth(negativeDM, prevSmoothedNDM, i, period);

        // Get DIs and Dx
        const posDI = (avgPosDM / avgTR) * 100;
        const negDI = (avgNegDM / avgTR) * 100;
        const dx = Math.abs((posDI - negDI) / (posDI + negDI)) * 100;

        // Get ADX
        const adx = wilderSmoothEMA(dx, prevSmoothedDX, i, period);

        // Store values for the next round
        prevSmoothedTR.push(avgTR);
        prevSmoothedPDM.push(avgPosDM);
        prevSmoothedNDM.push(avgNegDM);
        prevSmoothedDX.push(adx);

        // Store results
        const { date } = data[i];
        result.push({ date, adx, posDI, negDI });
      }
      setState(result);
    }
  }, [setState, period, data, dataAdx]);
};

// Get Directional Movement(DM)
const getDMs = (data: TypePrice[], i: number) => {
  const up = i ? data[i].high - data[i - 1].high : data[i].high;
  const down = i ? data[i - 1].low - data[i].low : data[i].low;
  const positiveDM = up > down && up > 0 ? up : 0;
  const negativeDM = up < down && down > 0 ? down : 0;
  return { positiveDM, negativeDM };
};
