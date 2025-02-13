import { useAtom } from 'jotai';
import { useEffect } from 'react';
import { getCurrentTR, wilderSmoothEMA } from '../../controllers/avg';
import { atrp } from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const useAtrp = (req: gType.PriceRequest, period = 14) => {
  const { data } = useGetPrices(req);
  const [dataAtrp, setState] = useAtom(atrp(req));

  useEffect(() => {
    if (data && data.length && !dataAtrp.length) {
      const result: gType.Atrp[] = [];
      const prevAtr: number[] = [];

      for (let i = 0; i < data.length; i++) {
        const atr = wilderSmoothEMA(getCurrentTR(data, i), prevAtr, i, period);
        const atrp = (atr / data[i].close) * 100;
        prevAtr.push(atr);

        const { date } = data[i];
        result.push({ date, atrp });
      }
      setState(result);
    }
  }, [setState, period, data, dataAtrp]);
};
