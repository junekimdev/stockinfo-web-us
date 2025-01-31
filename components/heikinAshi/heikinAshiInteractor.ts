import { useAtom } from 'jotai';
import { useCallback, useEffect, ChangeEvent } from 'react';
import { StatePriceHeikinAshi } from '../../controllers/data/states';
import { TypePrice, TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import { HeikinAshiStateDisplay } from './heikinAshiState';
import { HeikinAshiTypeDisplayItem } from './heikinAshiType';

export const useDisplayCheckboxChange = (what: HeikinAshiTypeDisplayItem) => {
  const [display, setState] = useAtom(HeikinAshiStateDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState({ ...display, [what]: e.currentTarget.checked });
    },
    [setState, display, what],
  );
};

export const useHeikinAshi = (req: TypePriceRequest) => {
  const { data } = useGetPrices(req);
  const [dataHeikinAshi, setState] = useAtom(StatePriceHeikinAshi(req));

  useEffect(() => {
    if (data && data.length && !dataHeikinAshi.length) {
      const bar: TypePrice[] = data.map((v) => ({
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
