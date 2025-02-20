import * as gType from '../../controllers/data/types';
import styles from './search.module.scss';
import { useCompanyClick } from './searchInteractor';

const View = (props: { data: gType.Company; uuid: string }) => {
  const { data, uuid } = props;
  const { name, code, fullName, mkt } = data;
  const onCompanyClick = useCompanyClick(uuid, data);

  return (
    <li className={styles.companyCard} onClick={onCompanyClick}>
      <div className={styles.companyName} title={name}>
        {name}
      </div>
      <div className={styles.companyCode}>{code}</div>
      <div className={styles.companyMkt}>{mkt}</div>
      <div className={styles.companyCorp} title={fullName}>
        {name}
      </div>
    </li>
  );
};

export default View;
