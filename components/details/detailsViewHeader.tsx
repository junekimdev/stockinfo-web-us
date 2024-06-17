import { useRecoilValue } from 'recoil';
import { EDGAR_VIEWER_LINK } from '../../controllers/apiURLs';
import { getDateString } from '../../controllers/chart';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetEdgarStatement } from '../../controllers/net/edgar';
import { useGetPrices } from '../../controllers/net/price';
import styles from './details.module.scss';

const View = () => {
  const { company } = useRecoilValue(StateCurrentTab);
  const { data } = useGetEdgarStatement(company.cik);
  const latestReq: TypePriceRequest = { code: company.code, type: 'latest' };
  const prices = useGetPrices(latestReq);
  const latestPrice = prices.data?.[0];
  const stockCnt = data?.outstandingStock.length ? data.outstandingStock[0].value : undefined;

  return (
    <header className={styles.header}>
      <div className={styles.headerTitle}>
        <h2 className={styles.headerName}>{company.name}</h2>
        <a
          href={EDGAR_VIEWER_LINK + company.cik}
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
          <h5>Closed At :</h5>
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
