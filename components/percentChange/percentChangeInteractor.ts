import { useAtom } from 'jotai';
import { useEffect } from 'react';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const usePricePercentChange = (req: gType.PriceRequest) => {
  const { data } = useGetPrices(req);
  const [dataPricePercentChange, setState] = useAtom(gState.pricePercentChange(req));

  useEffect(() => {
    if (data && data.length && !dataPricePercentChange.length) {
      // Init the array with the first vlaue
      const change: gType.PricePercentChange[] = [{ date: data[0].date, percent_change: 0 }];

      // Fill the rest of the array
      for (let i = 1; i < data.length; i++) {
        const percent_change = (100 * data[i].close) / data[i - 1].close - 100;
        change.push({ date: data[i].date, percent_change });
      }

      setState(change);
    }
  }, [setState, data, dataPricePercentChange]);
};
