import { useAtom, useAtomValue } from 'jotai';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { getPriceEMAOverAll } from '../../controllers/avg';
import { StatePriceHeikinAshi, StatePriceHeikinAshiSmoothed } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { HeikinAshiSmoothedStateDisplay } from './heikinAshiState';
import { HeikinAshiSmoothedTypeDisplayItem } from './heikinAshiType';

export const useDisplayCheckboxChange = (what: HeikinAshiSmoothedTypeDisplayItem) => {
  const [display, setState] = useAtom(HeikinAshiSmoothedStateDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState({ ...display, [what]: e.currentTarget.checked });
    },
    [setState, display, what],
  );
};

export const useHeikinAshiSmoothed = (
  req: TypePriceRequest,
  options?: { period1?: number; period2?: number },
) => {
  const { period1 = 10, period2 = 10 } = options ?? {};
  const data = useAtomValue(StatePriceHeikinAshi(req));
  const [dataHeikinAshiSmoothed, setState] = useAtom(StatePriceHeikinAshiSmoothed(req));

  useEffect(() => {
    if (data && data.length > 1 && !dataHeikinAshiSmoothed.length) {
      const smoothed = getPriceEMAOverAll(getPriceEMAOverAll(data, period1), period2);
      setState(smoothed);
    }
  }, [setState, data, dataHeikinAshiSmoothed, period1, period2]);
};
