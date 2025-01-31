import { useAtomValue } from 'jotai';
import { useClearTabsClick, useSaveTabsClick } from '../../controllers/data/hooks';
import { StateCompanyTabs } from '../../controllers/data/states';
import styles from './mainFrame.module.scss';
import { useCloseAllClick } from './mainFrameInteractor';
import { MainFrameStateMenuOpened } from './mainFrameStates';

const View = () => {
  const menuOpened = useAtomValue(MainFrameStateMenuOpened);
  const tabs = useAtomValue(StateCompanyTabs);
  const onCloseAllClick = useCloseAllClick();
  const onSaveTabsClick = useSaveTabsClick();
  const onClearTabsClick = useClearTabsClick();

  return (
    <div className={menuOpened ? styles.menusOpened : styles.menusClosed}>
      <button className={styles.closeAllBtn} onClick={onCloseAllClick} disabled={!tabs.length}>
        Close All Tabs
      </button>
      <button className={styles.menuBtn} onClick={onSaveTabsClick} disabled={!tabs.length}>
        Save Tabs in Browser
      </button>
      <button className={styles.menuBtn} onClick={onClearTabsClick}>
        Clear Tabs in Browser
      </button>
    </div>
  );
};

export default View;
