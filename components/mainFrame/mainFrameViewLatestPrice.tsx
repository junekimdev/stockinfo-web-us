import * as gType from '../../controllers/data/types';
import { getDatetimeString } from '../../controllers/datetime';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './mainFrame.module.scss';

const View = (props: { code: string }) => {
  const { code } = props;
  const latestReq: gType.PriceRequest = { code, type: 'latest' };
  const { data } = useGetPricesLatest(latestReq);

  return (
    <h5>
      <div className={styles.latestPriceWrapper}>
        latest price:
        {data ? (
          <>
            <span className={styles.latestPrice}>{data.close.toLocaleString()}</span>
            USD
          </>
        ) : (
          <div className={styles.spinner}></div>
        )}
      </div>
      <div>{getDatetimeString(data?.date)}</div>
    </h5>
  );
};

export default View;
