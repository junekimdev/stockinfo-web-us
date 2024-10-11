import { useRecoilValue } from 'recoil';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypeCompanyTab } from '../../controllers/data/types';
import styles from './mainFrame.module.scss';
import { useMoveToTabClick, useRemoveTabClick } from './mainFrameInteractor';

const View = (props: { tab: TypeCompanyTab }) => {
  const { tab } = props;
  const currentTab = useRecoilValue(StateCurrentTab);
  const onMoveToTabClick = useMoveToTabClick(tab);
  const onRemoveTabClick = useRemoveTabClick(tab);

  return (
    <li
      title={tab.company.name}
      className={tab.uuid === currentTab.uuid ? styles.tabItemCurrent : styles.tabItem}
      onClick={onMoveToTabClick}
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
