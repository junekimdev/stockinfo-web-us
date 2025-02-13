import { useAtom } from 'jotai';
import { useEffect } from 'react';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const useHeikinAshi = (req: gType.PriceRequest) => {
  const { data } = useGetPrices(req);
  const [dataHeikinAshi, setState] = useAtom(gState.priceHeikinAshi(req));

  useEffect(() => {
    if (data && data.length && !dataHeikinAshi.length) {
      const bar: gType.Price[] = data.map((v) => ({
        date: v.date,
        open: 0,
        close: (v.open + v.close + v.high + v.low) / 4,
        high: v.high,
        low: v.low,
      }));

      for (let i = 0; i < bar.length; i++) {
        bar[i].open = i ? (bar[i - 1].open + bar[i - 1].close) / 2 : bar[i].close;
      }

      setState(bar);
    }
  }, [setState, data, dataHeikinAshi]);
};
