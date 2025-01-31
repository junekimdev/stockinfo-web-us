import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { StateChaikin } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './chaikin.module.scss';
import draw from './chaikinFnDraw';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  const { data } = useGetPrices(req);
  const dataChaikin = useAtomValue(StateChaikin(req));

  const chartTitle = `${req.type} CO`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  useEffect(() => {
    if (dataChaikin.length) {
      draw(chartID, dataChaikin.slice(-max), marginLeft);
    }
  }, [chartID, marginLeft, max, data, dataChaikin]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="CO(Chaikin Oscillator) is a momentum indicator developed by Marc Chaikin : CO (3,10)"
        >
          info
        </span>
        <h5>CO &gt; 0: buying pressure is stronger,</h5>
        <h5>CO &lt; 0: selling pressure is stronger</h5>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
    </div>
  );
};

export default Presenter;
