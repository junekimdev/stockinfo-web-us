import { useEffect } from 'react';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './miniPrice.module.scss';
import draw from './miniPriceFnDraw';
import Placeholder from './miniPriceViewPlaceholder';

const Presenter = (props: { req: TypePriceRequest; max?: number }) => {
  const { req, max = 50 } = props;
  const { data } = useGetPrices(req);
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  useEffect(() => {
    const ready = data && data.length;
    if (ready) {
      draw(chartID, data.slice(-max));
    }
  }, [chartID, max, data]);

  return data && data.length ? <svg id={chartID} className={styles.chart}></svg> : <Placeholder />;
};

export default Presenter;
