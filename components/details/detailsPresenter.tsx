import { useAtomValue } from 'jotai';
import { useToggleDetails } from '../../controllers/data/hooks';
import { StateCurrentTab } from '../../controllers/data/states';
import { useGetEdgarStatement } from '../../controllers/net/edgar';
import styles from './details.module.scss';
import CashFlow from './detailsViewCashFlow';
import Diagram from './detailsViewDiagram';
import Header from './detailsViewHeader';
import Income from './detailsViewIncome';
import SoFP from './detailsViewSoFP';

const Presenter = () => {
  const { company } = useAtomValue(StateCurrentTab);
  const { data } = useGetEdgarStatement(company.cik);

  const onToggleDetails = useToggleDetails();

  return (
    <section className={styles.container}>
      <div className={styles.closeBtn} onClick={onToggleDetails}></div>
      <div className={styles.details}>
        {data?.assets.length ? (
          <>
            <Header />
            <Diagram />
            <hr />
            <SoFP />
            <hr />
            <Income />
            <hr />
            <CashFlow />
            <div className={styles.inform} title="'Mn' stands for 'Million' (백만)">
              <span className="material-symbols-outlined">info</span>
              <p>&#39;Mn&#39; stands for &#39;Million&#39; (백만)</p>
            </div>
          </>
        ) : (
          <div className={styles.spinner}></div>
        )}
      </div>
    </section>
  );
};

export default Presenter;
