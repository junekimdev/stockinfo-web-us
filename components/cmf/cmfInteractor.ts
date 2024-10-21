import { ChangeEvent, useCallback } from 'react';
import { useSetRecoilState } from 'recoil';
import { StateCMFDisplay } from '../../controllers/data/states';
import { TypeCMFDisplayItem } from '../../controllers/data/types';

export const useDisplayCheckboxChange = (what: TypeCMFDisplayItem) => {
  const setState = useSetRecoilState(StateCMFDisplay);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState((prev) => ({ ...prev, [what]: e.currentTarget.checked }));
    },
    [what],
  );
};
