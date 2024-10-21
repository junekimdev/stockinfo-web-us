import { useEffect } from 'react';
import { useRecoilState } from 'recoil';
import { StatePricePercentChange } from '../../controllers/data/states';
import { TypePricePercentChange, TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';

export const usePricePercentChange = (req: TypePriceRequest) => {
  const { data } = useGetPrices(req);
  const [dataPricePercentChange, setState] = useRecoilState(StatePricePercentChange(req));

  useEffect(() => {
    if (data && data.length && !dataPricePercentChange.length) {
      // Init the array with the first vlaue
      const change: TypePricePercentChange[] = [{ date: data[0].date, percent_change: 0 }];

      // Fill the rest of the array
      for (let i = 1; i < data.length; i++) {
        const percent_change = (100 * data[i].close) / data[i - 1].close - 100;
        change.push({ date: data[i].date, percent_change });
      }

      setState(change);
    }
  }, [data, dataPricePercentChange]);
};
