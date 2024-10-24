import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
import { useRecoilState, useRecoilValue, useSetRecoilState } from 'recoil';
import { LOCAL_STORAGE_KEY_COMPANY_TABS } from '../apiURLs';
import {
  StateCompanyTabs,
  StateCurrentTab,
  StateDetailsOpened,
  StateTabsInitiated,
} from './states';
import { TypeCompanyTab } from './types';

export const useCheckCurrentTab = () => {
  const router = useRouter();
  const currentTab = useRecoilValue(StateCurrentTab);

  useEffect(() => {
    if (!currentTab.uuid) router.replace('/');
  }, [router, currentTab]);
};

export const useLoadCompanyTabs = () => {
  const [initiated, setInit] = useRecoilState(StateTabsInitiated);
  const setTabs = useSetRecoilState(StateCompanyTabs);

  useEffect(() => {
    if (initiated) return;
    setInit(true);

    const tabsString = window.localStorage.getItem(LOCAL_STORAGE_KEY_COMPANY_TABS);
    if (tabsString) {
      try {
        const savedTabs: TypeCompanyTab[] = JSON.parse(tabsString);
        setTabs(savedTabs);
      } catch (error) {
        console.error(error);
      }
    }
  }, [initiated]);
};

export const useSaveTabsClick = () => {
  const tabs = useRecoilValue(StateCompanyTabs);

  return useCallback(() => {
    window.localStorage.setItem(LOCAL_STORAGE_KEY_COMPANY_TABS, JSON.stringify(tabs));
    window.alert('Saved all tabs in storage');
  }, [tabs]);
};

export const useClearTabsClick = () => {
  return useCallback(() => {
    window.localStorage.removeItem(LOCAL_STORAGE_KEY_COMPANY_TABS);
    window.alert('Cleared all tabs in storage');
  }, []);
};

export const useToggleDetails = () => {
  const setState = useSetRecoilState(StateDetailsOpened);

  return useCallback(() => setState((v) => !v), []);
};
