import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { useCallback, useEffect } from 'react';
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
  const currentTab = useAtomValue(StateCurrentTab);

  useEffect(() => {
    if (!currentTab.uuid) router.replace('/');
  }, [router, currentTab]);
};

export const useLoadCompanyTabs = () => {
  const [initiated, setInit] = useAtom(StateTabsInitiated);
  const setTabs = useSetAtom(StateCompanyTabs);

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
  }, [setInit, setTabs, initiated]);
};

export const useSaveTabsClick = () => {
  const tabs = useAtomValue(StateCompanyTabs);

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
  const [opened, setOpened] = useAtom(StateDetailsOpened);

  return useCallback(() => setOpened(!opened), [setOpened, opened]);
};
