import { useAtom } from 'jotai';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { StatePricePercentChange } from '../../controllers/data/states';
import { TypePricePercentChange, TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import { PercentChangeStateDisplay } from './percentChangeState';
import { PercentChangeTypeDisplayItem } from './percentChangeType';

export const useDisplayCheckboxChange = (what: PercentChangeTypeDisplayItem) => {
  const [display, setState] = useAtom(PercentChangeStateDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState({ ...display, [what]: e.currentTarget.checked });
    },
    [setState, display, what],
  );
};

export const usePricePercentChange = (req: TypePriceRequest) => {
  const { data } = useGetPrices(req);
  const [dataPricePercentChange, setState] = useAtom(StatePricePercentChange(req));

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
  }, [setState, data, dataPricePercentChange]);
};
