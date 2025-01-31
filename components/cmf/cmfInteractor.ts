import { useAtom } from 'jotai';
import { ChangeEvent, useCallback } from 'react';
import { CmfStateDisplay } from './cmfState';
import { CmfTypeDisplayItem } from './cmfType';

export const useDisplayCheckboxChange = (what: CmfTypeDisplayItem) => {
  const [display, setState] = useAtom(CmfStateDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState({ ...display, [what]: e.currentTarget.checked });
    },
    [setState, display, what],
  );
};
