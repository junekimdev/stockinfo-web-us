import * as gType from '../../controllers/data/types';
import styles from './search.module.scss';
import { useCompanyClick } from './searchInteractor';

const View = (props: { data: gType.Company; uuid: string }) => {
  const { data, uuid } = props;
  const { name, codePrice, fullName, mkt } = data;
  const onCompanyClick = useCompanyClick(uuid, data);

  return (
    <li className={styles.companyCard} onClick={onCompanyClick}>
      <div className={styles.companyName} title={name}>
        {name}
      </div>
      <div className={styles.companyCode}>{codePrice}</div>
      <div className={styles.companyMkt}>{mkt}</div>
      <div className={styles.companyCorp} title={fullName}>
        {fullName}
      </div>
    </li>
  );
};

export default View;
