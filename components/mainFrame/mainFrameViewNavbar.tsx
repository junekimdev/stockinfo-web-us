import { useAtomValue } from 'jotai';
import { useEffect, useRef, useState } from 'react';
import { DIFF_NATION_URL } from '../../controllers/apiURLs';
import { StateCompanyTabs } from '../../controllers/data/states';
import styles from './mainFrame.module.scss';
import {
  useAddNewTabClick,
  useDragEnd,
  useDragEnterCapture,
  useDragStart,
  useDrop,
  useMoveToHome,
  useToggleMenu,
  useTouchEnd,
  useTouchMove,
  useTouchStart,
} from './mainFrameInteractor';
import { MainFrameStateMenuOpened } from './mainFrameStates';
import Tab from './mainFrameViewTab';

const View = () => {
  const tabs = useAtomValue(StateCompanyTabs);
  const menuOpened = useAtomValue(MainFrameStateMenuOpened);
  const [dragged, setDragged] = useState<HTMLLIElement>();
  const ulRef = useRef<HTMLUListElement>(null);

  const onToggleMenu = useToggleMenu();
  const moveToHome = useMoveToHome();
  const onAddNewTabClick = useAddNewTabClick();
  const onDragStart = useDragStart(setDragged);
  const onDragEnd = useDragEnd(dragged, setDragged);
  const onDragEnterCapture = useDragEnterCapture(dragged);
  const onDrop = useDrop();
  const onTouchStart = useTouchStart(setDragged);
  const onTouchMove = useTouchMove(dragged);
  const onTouchEnd = useTouchEnd(dragged, setDragged);

  // By `event.preventDefault()` "window scrolling" is disabled while touch events are being fired.
  // `touchstart` & `touchmove` are passive event listeners, which means
  // these events require to set passive false in order to use `preventDefault()`.
  // However, React doesn't provide an easy way to set it false at the moment.
  // So, use `useRef`+`useEffect`+`addEventListener` to set it false as a work-around.
  useEffect(() => {
    const { current } = ulRef;
    if (!current) return;
    const abort = new AbortController();
    const { signal } = abort;
    current.addEventListener('touchstart', onTouchStart, { passive: false, signal });
    current.addEventListener('touchmove', onTouchMove, { passive: false, signal });
    return () => abort.abort();
  }, [ulRef, onTouchStart, onTouchMove]);

  return (
    <nav className={styles.navbarVertical}>
      <div className={styles.brandWrapper}>
        <h1 onClick={moveToHome}>
          JK Stock
          <br />
          US
        </h1>
      </div>
      <div className={styles.changeNation}>
        <a href={DIFF_NATION_URL}>Go to KR Stock</a>
      </div>
      <div className={styles.addNewTab} onClick={onAddNewTabClick}>
        +
      </div>
      <ul
        className={styles.tabList}
        onDragStart={onDragStart}
        onDragEnd={onDragEnd}
        onDragEnterCapture={onDragEnterCapture}
        onDragOver={(e) => e.preventDefault()}
        onDrop={onDrop}
        onTouchEnd={onTouchEnd}
        onTouchCancel={onTouchEnd}
        ref={ulRef}
      >
        {tabs.map((tab) => (
          <Tab key={tab.uuid} tab={tab} />
        ))}
      </ul>
      <div className={styles.menuToggleBtn} onClick={onToggleMenu}>
        <div className={menuOpened ? styles.menuCloseBtn : styles.menuOpenBtn}></div>
      </div>
    </nav>
  );
};

export default View;
