import { useEffect } from 'react';
import { useRecoilState, useRecoilValue } from 'recoil';
import { getPriceEMAOverAll } from '../../controllers/avg';
import { StatePriceHeikinAshi, StatePriceHeikinAshiSmoothed } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';

export const useHeikinAshiSmoothed = (
  req: TypePriceRequest,
  options?: { period1?: number; period2?: number },
) => {
  const { period1 = 10, period2 = 10 } = options ?? {};
  const data = useRecoilValue(StatePriceHeikinAshi(req));
  const [dataHeikinAshiSmoothed, setState] = useRecoilState(StatePriceHeikinAshiSmoothed(req));

  useEffect(() => {
    if (data && data.length > 1 && !dataHeikinAshiSmoothed.length) {
      const smoothed = getPriceEMAOverAll(getPriceEMAOverAll(data, period1), period2);
      setState(smoothed);
    }
  }, [data, dataHeikinAshiSmoothed]);
};
