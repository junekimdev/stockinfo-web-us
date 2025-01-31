import { useAtom } from 'jotai';
import { ChangeEvent, useCallback } from 'react';
import { PriceStateDisplay } from './priceState';
import { PriceTypeDisplayItem } from './priceType';

export const useDisplayCheckboxChange = (what: PriceTypeDisplayItem) => {
  const [display, setState] = useAtom(PriceStateDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState({ ...display, [what]: e.currentTarget.checked });
    },
    [setState, display, what],
  );
};
