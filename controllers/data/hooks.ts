import { PrimitiveAtom, useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useRouter } from 'next/router';
import { ChangeEvent, KeyboardEvent, useCallback, useEffect } from 'react';
import { LOCAL_STORAGE_KEY_COMPANY_TABS } from '../apiURLs';
import * as gState from './states';
import * as gType from './types';

export const useCheckCurrentTab = () => {
  const router = useRouter();
  const currentTab = useAtomValue(gState.currentTab);

  useEffect(() => {
    if (!currentTab.uuid) router.replace('/');
  }, [router, currentTab]);
};

export const useLoadCompanyTabs = () => {
  const [initiated, setInit] = useAtom(gState.tabsInitiated);
  const setTabs = useSetAtom(gState.companyTabs);

  useEffect(() => {
    if (initiated) return;
    setInit(true);

    const tabsString = window.localStorage.getItem(LOCAL_STORAGE_KEY_COMPANY_TABS);
    if (tabsString) {
      try {
        const savedTabs: gType.CompanyTab[] = JSON.parse(tabsString);
        setTabs(savedTabs);
      } catch (error) {
        console.error(error);
      }
    }
  }, [setInit, setTabs, initiated]);
};

export const useSaveTabsClick = () => {
  const tabs = useAtomValue(gState.companyTabs);

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
  const [opened, setOpened] = useAtom(gState.detailsOpened);

  return useCallback(() => setOpened(!opened), [setOpened, opened]);
};

export const useInputChange = <T>(atom: PrimitiveAtom<T>, what: keyof T) => {
  const [values, setState] = useAtom(atom);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      const v = typeof values[what] === 'boolean' ? e.currentTarget.checked : e.currentTarget.value;
      setState({ ...values, [what]: v });
    },
    [what, setState, values],
  );
};

export const useEnterKeyAsClick = () => {
  return useCallback((e: KeyboardEvent<HTMLElement>) => {
    if (e.key === 'Enter') e.currentTarget.click();
  }, []);
};
