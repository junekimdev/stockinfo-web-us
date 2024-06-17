import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { useRecoilState, useResetRecoilState, useSetRecoilState } from 'recoil';
import { LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS } from '../../controllers/apiURLs';
import {
  StateCompanyTabs,
  StateCurrentTab,
  StateRecentSearchTabs,
  StateSearchInput,
} from '../../controllers/data/states';
import { TypeCompany, TypeCompanyTab } from '../../controllers/data/types';

export const useSearchInputChange = () => {
  const setState = useSetRecoilState(StateSearchInput);

  return useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setState(e.currentTarget.value);
  }, []);
};

export const useCompanyClick = (uuid: string, company: TypeCompany) => {
  const [companyTabs, setCompanyTabs] = useRecoilState(StateCompanyTabs);
  const [recentSearchTabs, setRecentSearchTabs] = useRecoilState(StateRecentSearchTabs);
  const setCurrentTab = useSetRecoilState(StateCurrentTab);
  const resetSearchInput = useResetRecoilState(StateSearchInput);
  const router = useRouter();

  return useCallback(() => {
    const tabExists: TypeCompanyTab = companyTabs.reduce(
      (p, v) => (v.company.code === company.code ? v : p),
      { uuid: '', company, mainType: 'daily' },
    );

    // Add to tabs and set it as current
    const tab: TypeCompanyTab = tabExists.uuid ? tabExists : { uuid, company, mainType: 'daily' };
    if (!tabExists.uuid) setCompanyTabs((v) => [tab, ...v]);
    setCurrentTab(tab);
    resetSearchInput();

    // Add to recent search tabs
    const saved = recentSearchTabs.reduce(
      (p, v) => p || v.company.code === tab.company.code,
      false,
    );
    if (!saved) {
      const recent = [...recentSearchTabs.slice(-3), tab];
      setRecentSearchTabs(recent);
      window.localStorage.setItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS, JSON.stringify(recent));
    }

    router.replace('/chart', '/');
  }, [uuid, company, companyTabs, recentSearchTabs]);
};

export const useLoadRecentSearchTabs = () => {
  const setState = useSetRecoilState(StateRecentSearchTabs);

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS);
    if (saved) {
      const tabs: TypeCompanyTab[] = JSON.parse(saved);
      setState(tabs);
    }
  }, []);
};

export const useDeleteAllRecentClick = () => {
  const resetState = useResetRecoilState(StateRecentSearchTabs);

  return useCallback(() => {
    resetState();
    window.localStorage.removeItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS);
  }, []);
};
