import { useAtom, useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { getPriceEMAOverAll } from '../../controllers/avg';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';

export const useHeikinAshiSmoothed = (
  req: gType.PriceRequest,
  options?: { period1?: number; period2?: number },
) => {
  const { period1 = 10, period2 = 10 } = options ?? {};
  const data = useAtomValue(gState.priceHeikinAshi(req));
  const [dataHeikinAshiSmoothed, setState] = useAtom(gState.priceHeikinAshiSmoothed(req));

  useEffect(() => {
    if (data && data.length > 1 && !dataHeikinAshiSmoothed.length) {
      const smoothed = getPriceEMAOverAll(getPriceEMAOverAll(data, period1), period2);
      setState(smoothed);
    }
  }, [setState, data, dataHeikinAshiSmoothed, period1, period2]);
};
