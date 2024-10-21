import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { StatePriceHeikinAshi } from '../../controllers/data/states';
import { TypePrice, TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

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
