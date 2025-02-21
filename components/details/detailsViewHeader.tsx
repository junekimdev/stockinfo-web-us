import { useAtomValue } from 'jotai';
import { EDGAR_VIEWER_LINK } from '../../controllers/apiURLs';
import { getDateString } from '../../controllers/chart';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetEdgarStatement } from '../../controllers/net/edgar';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './details.module.scss';

const View = () => {
  const { company } = useAtomValue(gState.currentTab);
  const { data } = useGetEdgarStatement(company.codeReport);
  const req: gType.PriceRequest = { code: company.codePrice, type: 'latest' };
  const { data: latestPrice } = useGetPricesLatest(req);
  const stockCnt = data?.outstandingStock[0].value;

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        <h2 className={styles.headerName}>{company.name}</h2>
        <a
          href={EDGAR_VIEWER_LINK + company.codeReport}
          className={styles.toViewer}
          target="_blank"
          rel="noreferrer noopener"
        >
          <i className="fa-solid fa-up-right-from-square"></i>
        </a>
      </div>
      <div className={styles.headerItemsWrapper}>
        <div className={styles.headerItem}>
          <h5>Date :</h5>
          <span>{latestPrice && getDateString(latestPrice)}</span>
        </div>
        <div className={styles.headerItem}>
          <h5>Latest Price :</h5>
          <span>{latestPrice?.close.toLocaleString()}</span>
        </div>
        <div className={styles.headerItem}>
          <h5>Stock Counts :</h5>
          <span>{stockCnt?.toLocaleString()}</span>
        </div>
      </div>
    </header>
  );
};

export default View;
