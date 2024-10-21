import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { getCurrentTR, wilderSmoothEMA } from '../../controllers/avg';
import { StateAtrp } from '../../controllers/data/states';
import { TypeAtrp, TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const useAtrp = (req: TypePriceRequest, period = 14) => {
  const { data } = useGetPrices(req);
  const [dataAtrp, setState] = useRecoilState(StateAtrp(req));

  useEffect(() => {
    if (data && data.length && !dataAtrp.length) {
      const result: TypeAtrp[] = [];
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
  }, [period, data, dataAtrp]);
};
