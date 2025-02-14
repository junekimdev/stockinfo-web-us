import { useAtomValue } from 'jotai';
import { useEnterKeyAsClick } from '../../controllers/data/hooks';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import styles from './mainFrame.module.scss';
import { useMoveToTabClick, useRemoveTabClick } from './mainFrameInteractor';

const View = (props: { tab: gType.CompanyTab }) => {
  const { tab } = props;
  const currentTab = useAtomValue(gState.currentTab);
  const onMoveToTabClick = useMoveToTabClick(tab);
  const onRemoveTabClick = useRemoveTabClick(tab);
  const onEnterKey = useEnterKeyAsClick();

  return (
    <li
      title={tab.company.name}
      className={tab.uuid === currentTab.uuid ? styles.tabItemCurrent : styles.tabItem}
      onClick={onMoveToTabClick}
      onKeyUp={onEnterKey}
      tabIndex={0}
      data-drag-object
      data-data={JSON.stringify(tab)}
    >
      <i title="move" className={`fa-solid fa-grip-vertical ${styles.tabIconDnD}`} draggable></i>
      <div className={styles.tabItemText}>{tab.company.code}</div>
      <i
        title="close"
        className={`fa-solid fa-xmark ${styles.tabIconClose}`}
        onClick={onRemoveTabClick}
      ></i>
    </li>
  );
};

export default View;
