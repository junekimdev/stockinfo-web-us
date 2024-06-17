import { useRouter } from 'next/router';
import { MouseEvent, useCallback } from 'react';
import { useRecoilState, useRecoilValue, useResetRecoilState, useSetRecoilState } from 'recoil';
import { StateCompanyTabs, StateCurrentTab } from '../../controllers/data/states';
import { TypeCompanyTab, TypePriceRequestType } from '../../controllers/data/types';
import { MainFrameStateMenuOpened } from './mainFrameStates';

export const useToggleMenu = () => {
  const setState = useSetRecoilState(MainFrameStateMenuOpened);

  return useCallback(() => setState((v) => !v), []);
};

export const useCloseAllClick = () => {
  const resetTabs = useResetRecoilState(StateCompanyTabs);
  const resetCurrent = useResetRecoilState(StateCurrentTab);
  const setOpened = useSetRecoilState(MainFrameStateMenuOpened);
  const router = useRouter();

  return useCallback(() => {
    resetTabs();
    resetCurrent();
    setOpened(false);
    router.replace('/', '/');
  }, []);
};

export const useAddNewTabClick = () => {
  const resetState = useResetRecoilState(StateCurrentTab);
  const router = useRouter();

  return useCallback(() => {
    resetState();
    router.replace('/', '/');
  }, []);
};

export const useMoveToTabClick = (tab: TypeCompanyTab) => {
  const setState = useSetRecoilState(StateCurrentTab);
  const router = useRouter();

  return useCallback(() => {
    setState(tab);
    router.replace('/chart', '/');
  }, [tab]);
};

export const useRemoveTabClick = (tab: TypeCompanyTab) => {
  const [tabs, setTabs] = useRecoilState(StateCompanyTabs);
  const currentTab = useRecoilValue(StateCurrentTab);
  const resetCurrent = useResetRecoilState(StateCurrentTab);
  const router = useRouter();

  return useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      setTabs(tabs.filter((v) => v.uuid !== tab.uuid));
      if (currentTab.uuid === tab.uuid) {
        resetCurrent();
        router.replace('/', '/');
      }
    },
    [tab, tabs, currentTab],
  );
};

export const useSwitchTypeBtnClick = () => {
  const setTabs = useSetRecoilState(StateCompanyTabs);
  const [currentTab, setCurrentTab] = useRecoilState(StateCurrentTab);

  return useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const mainType: TypePriceRequestType = currentTab.mainType === 'daily' ? 'weekly' : 'daily';
      const updatedTab = { ...currentTab, mainType };

      setCurrentTab(updatedTab);

      setTabs((prev) => prev.map((v) => (v.uuid === currentTab.uuid ? updatedTab : v)));
    },
    [currentTab],
  );
};
