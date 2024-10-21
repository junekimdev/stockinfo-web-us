import { useEffect } from 'react';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './volume.module.scss';
import draw from './volumeFnDraw';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  const { data } = useGetPrices(req);

  const chartTitle = `${req.type} volume`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  useEffect(() => {
    const ready = data && data.length;
    if (ready) {
      draw(chartID, data.slice(-max), marginLeft);
    }
  }, [chartID, marginLeft, max, data]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
      <div className={styles.displaySelectorWrapper} onClick={(e) => e.stopPropagation()}></div>
    </div>
  );
};

export default Presenter;
