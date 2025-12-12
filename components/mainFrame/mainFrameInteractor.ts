import { useAtom, useAtomValue, useSetAtom } from 'jotai';
import { useResetAtom } from 'jotai/utils';
import { useRouter } from 'next/router';
import { Dispatch, DragEvent, MouseEvent, SetStateAction, useCallback } from 'react';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import * as mState from './mainFrameState';

export const useToggleMenu = () => {
  const [opened, setOpened] = useAtom(mState.menuOpened);

  return useCallback(() => setOpened(!opened), [setOpened, opened]);
};

export const useMoveToHome = () => {
  const router = useRouter();

  return useCallback(() => {
    if (router.pathname !== '/') router.replace('/');
  }, [router]);
};

export const useCloseAllClick = () => {
  const resetTabs = useResetAtom(gState.companyTabs);
  const setOpened = useSetAtom(mState.menuOpened);
  const router = useRouter();

  return useCallback(() => {
    resetTabs();
    setOpened(false);
    if (router.pathname !== '/search') router.replace('/search');
  }, [resetTabs, setOpened, router]);
};

export const useAddNewTabClick = () => {
  const router = useRouter();

  return useCallback(() => {
    if (router.pathname !== '/search') router.replace('/search');
  }, [router]);
};

export const useMoveToTabClick = (tab: gType.CompanyTab) => {
  const setCurrentTab = useSetAtom(gState.currentTab);
  const router = useRouter();

  return useCallback(() => {
    setCurrentTab(tab);
    if (router.pathname !== '/chart') router.replace('/chart');
  }, [setCurrentTab, tab, router]);
};

export const useRemoveTabClick = (tab: gType.CompanyTab) => {
  const [tabs, setTabs] = useAtom(gState.companyTabs);
  const currentTab = useAtomValue(gState.currentTab);
  const router = useRouter();

  return useCallback(
    (e: MouseEvent<HTMLElement>) => {
      e.stopPropagation();

      setTabs(tabs.filter((v) => v.uuid !== tab.uuid));
      if (currentTab.uuid === tab.uuid) {
        if (router.pathname !== '/search') router.replace('/search');
      }
    },
    [setTabs, tabs, tab, currentTab, router],
  );
};

export const useSwitchTypeBtnClick = () => {
  const [prevTabs, setTabs] = useAtom(gState.companyTabs);
  const [currentTab, setCurrentTab] = useAtom(gState.currentTab);

  return useCallback(
    (e: MouseEvent<HTMLButtonElement>) => {
      e.stopPropagation();

      const mainType: gType.PriceRequestType = currentTab.mainType === 'daily' ? 'weekly' : 'daily';
      const updatedTab = { ...currentTab, mainType };

      setCurrentTab(updatedTab);

      setTabs(prevTabs.map((v) => (v.uuid === currentTab.uuid ? updatedTab : v)));
    },
    [setCurrentTab, setTabs, prevTabs, currentTab],
  );
};

//==================== Drag and Drop Event Handlers ====================

export const useDragStart = (setDragged: Dispatch<SetStateAction<HTMLLIElement | undefined>>) => {
  return useCallback(
    (e: DragEvent<HTMLUListElement>) => {
      const el = e.target;
      if (!(el instanceof HTMLElement)) return;
      const p = el.parentElement;
      if (!(p instanceof HTMLLIElement)) return;

      p.classList.add('dragged');
      e.dataTransfer.setDragImage(p, 0, 0);
      setDragged(p);
    },
    [setDragged],
  );
};

export const useDragEnd = (
  dragged: HTMLLIElement | undefined,
  setDragged: Dispatch<SetStateAction<HTMLLIElement | undefined>>,
) => {
  return useCallback(() => {
    dragged?.classList.remove('dragged');
    setDragged(undefined);
  }, [dragged, setDragged]);
};

export const useDragEnterCapture = (dragged: HTMLLIElement | undefined) => {
  return useCallback(
    (e: DragEvent<HTMLUListElement>) => {
      const el = e.target;
      if (el instanceof HTMLElement && el.dataset.dragObject && dragged) {
        e.stopPropagation();
        const dy = el.offsetTop - dragged.offsetTop; // positive means moving downward
        const where = dy > 0 ? 'afterend' : 'beforebegin';
        dragged.parentElement?.removeChild(dragged);
        el.insertAdjacentElement(where, dragged);
      }
    },
    [dragged],
  );
};

export const useDrop = () => {
  const setTabs = useSetAtom(gState.companyTabs);

  return useCallback(
    (e: DragEvent<HTMLUListElement>) => {
      e.preventDefault();
      const tabs: gType.CompanyTab[] = [];
      const children = e.currentTarget.children;

      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        if (el instanceof HTMLElement && typeof el.dataset.data === 'string')
          tabs.push(JSON.parse(el.dataset.data) as gType.CompanyTab);
      }

      setTabs(tabs);
    },
    [setTabs],
  );
};

//==================== Touch Event Handlers ====================
const placeholderId = 'move-placeholder';

export const useTouchStart = (setDragged: Dispatch<SetStateAction<HTMLLIElement | undefined>>) => {
  return useCallback(
    // NOTICE: `TouchEvent` is Typescript event
    (e: TouchEvent) => {
      if (e.touches.length !== 1) return; // only first touch on the icon starts DnD
      if (!(e.target instanceof HTMLElement)) return;
      if (e.target.getAttribute('draggable') !== 'true') return;

      const p = e.target.parentElement;
      if (!(p instanceof HTMLLIElement)) return;
      e.preventDefault(); // This stops window scrolling while this touch event is fired

      // Move to follow touch point
      const { height, width } = p.getBoundingClientRect();
      p.classList.add('draggedByTouch');
      p.style.left = `${e.touches[0].clientX}px`;
      p.style.top = `${e.touches[0].clientY - height / 2}px`;
      setDragged(p);

      // Create a placeholder element
      const placeholder = document.createElement('li');
      placeholder.id = placeholderId;
      placeholder.style.width = `${width}px`;
      placeholder.style.height = `${height}px`;
      p.insertAdjacentElement('afterend', placeholder);
    },
    [setDragged],
  );
};

export const useTouchMove = (dragged: HTMLLIElement | undefined) => {
  return useCallback(
    // NOTICE: `TouchEvent` is Typescript event
    (e: TouchEvent) => {
      if (!dragged) return;
      e.preventDefault(); // This stops window scrolling while this touch event is fired

      const { height } = dragged.getBoundingClientRect();
      const { clientX, clientY } = e.touches[0];

      // follow touch point
      /* eslint-disable react-hooks/immutability */
      // allow mutation of the dragged on the move
      dragged.style.left = `${clientX - 8}px`;
      dragged.style.top = `${clientY - height / 2}px`;
      /* eslint-enable react-hooks/immutability */

      // if touch point enters into another element, change order
      const p = dragged.parentElement;
      if (!p) return;
      const placeholder = document.getElementById(placeholderId);
      if (!placeholder) return;

      for (let i = 0; i < p.children.length; i++) {
        const el = p.children[i];
        if (el.className === dragged.className || el.id === placeholderId) continue;

        const rect = el.getBoundingClientRect();
        const touchEntered = rect.y < clientY && clientY < rect.bottom;
        if (!touchEntered) continue;

        // Figure out direction
        const centerline = (rect.top + rect.bottom) / 2;
        const direction = centerline < clientY ? 'afterend' : 'beforebegin';

        // Skip if placeholder is already there
        const { top: pTop, bottom: pBtm } = placeholder.getBoundingClientRect();
        const pCenter = (pTop + pBtm) / 2;
        const tagetTop = direction === 'afterend' ? rect.bottom : rect.y - height;
        const targetBtm = tagetTop + height;
        if (tagetTop < pCenter && pCenter < targetBtm) continue;

        // Remove elements
        p.removeChild(placeholder);
        p.removeChild(dragged);

        // Insert back in
        el.insertAdjacentElement(direction, dragged);
        el.insertAdjacentElement(direction, placeholder);
        break;
      }
    },
    [dragged],
  );
};

export const useTouchEnd = (
  dragged: HTMLLIElement | undefined,
  setDragged: Dispatch<SetStateAction<HTMLLIElement | undefined>>,
) => {
  const setTabs = useSetAtom(gState.companyTabs);

  return useCallback(
    (e: React.TouchEvent<HTMLUListElement>) => {
      if (!dragged) return;

      // Remove placeholder
      const placeholder = document.getElementById(placeholderId);
      placeholder?.parentElement?.removeChild(placeholder);

      // Reset place
      dragged.classList.remove('draggedByTouch');
      dragged.removeAttribute('style');
      setDragged(undefined);

      // Update list state
      const tabs: gType.CompanyTab[] = [];
      const children = e.currentTarget.children;

      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        if (el instanceof HTMLElement && typeof el.dataset.data === 'string')
          tabs.push(JSON.parse(el.dataset.data) as gType.CompanyTab);
      }

      setTabs(tabs);
    },
    [setDragged, setTabs, dragged],
  );
};
