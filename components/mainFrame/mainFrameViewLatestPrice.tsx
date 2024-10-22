import { TypePrice, TypePriceRequest } from '../../controllers/data/types';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './mainFrame.module.scss';

const getDatetimeString = (data: TypePrice) => {
  const dd = data.date as Date;
  const year = dd.getFullYear();
  const month = (dd.getMonth() + 1).toString().padStart(2, '0');
  const day = dd.getDate().toString().padStart(2, '0');
  const hour = dd.getHours().toString().padStart(2, '0');
  const minute = dd.getMinutes().toString().padStart(2, '0');
  const second = dd.getSeconds().toString().padStart(2, '0');
  return `at ${year}-${month}-${day} ${hour}:${minute}:${second}`;
};

const View = (props: { code: string }) => {
  const { code } = props;
  const latestReq: TypePriceRequest = { code, type: 'latest' };
  const latestPrice = useGetPricesLatest(latestReq);

  return (
    <h5>
      <div className={styles.latestPriceWrapper}>
        latest price:
        {latestPrice.data ? (
          <>
            <span className={styles.latestPrice}>{latestPrice.data.close.toLocaleString()}</span>
            USD
          </>
        ) : (
          <div className={styles.spinner}></div>
        )}
      </div>
      <div>{latestPrice.data ? getDatetimeString(latestPrice.data) : ''}</div>
    </h5>
  );
};

export default View;
