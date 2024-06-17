import { TypeCompany } from '../../controllers/data/types';
import styles from './search.module.scss';
import { useCompanyClick } from './searchInteractor';

const View = (props: { data: TypeCompany; uuid: string }) => {
  const { data, uuid } = props;
  const { cik, code, name } = data;
  const onuseCompanyClick = useCompanyClick(uuid, data);

  return (
    <li className={styles.companyCard} onClick={onuseCompanyClick}>
      <div className={styles.companyName} title={name}>
        {name}
      </div>
      <div className={styles.companyCode}>{code}</div>
      <div className={styles.companyCIK}>{cik}</div>
      <div className={styles.companyCorp} title={name}>
        {name}
      </div>
    </li>
  );
};

export default View;
