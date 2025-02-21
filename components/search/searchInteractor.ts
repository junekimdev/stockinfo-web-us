import { useAtom, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useRouter } from 'next/router';
import { ChangeEvent, useCallback, useEffect } from 'react';
import { LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS } from '../../controllers/apiURLs';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';

export const useSearchInputChange = () => {
  const setState = useSetAtom(gState.searchInput);

  return useCallback(
    (e: ChangeEvent<HTMLInputElement>) => {
      setState(e.currentTarget.value);
    },
    [setState],
  );
};

export const useCompanyClick = (uuid: string, company: gType.Company) => {
  const [companyTabs, setCompanyTabs] = useAtom(gState.companyTabs);
  const [recentSearchTabs, setRecentSearchTabs] = useAtom(gState.recentSearchTabs);
  const setCurrentTab = useSetAtom(gState.currentTab);
  const resetSearchInput = useResetAtom(gState.searchInput);
  const router = useRouter();

  return useCallback(() => {
    const tabExists: gType.CompanyTab = companyTabs.reduce(
      (p, v) => (v.company.codePrice === company.codePrice ? v : p),
      { uuid: '', company, mainType: 'daily' },
    );

    // Add to tabs and set it as current
    const tab: gType.CompanyTab = tabExists.uuid ? tabExists : { uuid, company, mainType: 'daily' };
    if (!tabExists.uuid) setCompanyTabs([tab, ...companyTabs]);
    setCurrentTab(tab);
    resetSearchInput();

    // Add to recent search tabs
    const saved = recentSearchTabs.reduce(
      (p, v) => p || v.company.codePrice === tab.company.codePrice,
      false,
    );
    if (!saved) {
      const recent = [...recentSearchTabs.slice(-3), tab];
      setRecentSearchTabs(recent);
      window.localStorage.setItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS, JSON.stringify(recent));
    }

    if (router.pathname !== '/chart') router.replace('/chart');
  }, [
    setCompanyTabs,
    setCurrentTab,
    resetSearchInput,
    setRecentSearchTabs,
    uuid,
    company,
    companyTabs,
    recentSearchTabs,
    router,
  ]);
};

export const useLoadRecentSearchTabs = () => {
  const setState = useSetAtom(gState.recentSearchTabs);

  useEffect(() => {
    const saved = window.localStorage.getItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS);
    if (saved) {
      const tabs: gType.CompanyTab[] = JSON.parse(saved);
      setState(tabs);
    }
  }, [setState]);
};

export const useDeleteAllRecentClick = () => {
  const resetState = useResetAtom(gState.recentSearchTabs);

  return useCallback(() => {
    resetState();
    window.localStorage.removeItem(LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS);
  }, [resetState]);
};
