import { useRouter } from 'next/router';
import { Dispatch, DragEvent, MouseEvent, SetStateAction, useCallback } from 'react';
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
  const setTabs = useSetRecoilState(StateCompanyTabs);

  return useCallback((e: DragEvent<HTMLUListElement>) => {
    e.preventDefault();
    const tabs: TypeCompanyTab[] = [];
    const children = e.currentTarget.children;

    for (let i = 0; i < children.length; i++) {
      const el = children[i];
      if (el instanceof HTMLElement && typeof el.dataset.data === 'string')
        tabs.push(JSON.parse(el.dataset.data) as TypeCompanyTab);
    }

    setTabs(tabs);
  }, []);
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

      // follow touch point
      const { height } = dragged.getBoundingClientRect();
      const { clientX, clientY } = e.touches[0];
      dragged.style.left = `${clientX - 8}px`;
      dragged.style.top = `${clientY - height / 2}px`;

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
  const setTabs = useSetRecoilState(StateCompanyTabs);

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
      const tabs: TypeCompanyTab[] = [];
      const children = e.currentTarget.children;

      for (let i = 0; i < children.length; i++) {
        const el = children[i];
        if (el instanceof HTMLElement && typeof el.dataset.data === 'string')
          tabs.push(JSON.parse(el.dataset.data) as TypeCompanyTab);
      }

      setTabs(tabs);
    },
    [dragged, setDragged],
  );
};
