import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './atrp.module.scss';
import draw from './atrpFnDraw';
import { useAtrp } from './atrpInteractor';

const Presenter = (props: { req: gType.PriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;

  useAtrp(req);
  const { data } = useGetPrices(req);
  const dataAtrp = useAtomValue(gState.atrp(req));

  const chartTitle = `${req.type} ATRP`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  useEffect(() => {
    if (dataAtrp.length) {
      draw(chartID, dataAtrp.slice(-max), marginLeft);
    }
  }, [chartID, marginLeft, max, data, dataAtrp]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="ATRP(Average True Range Percent) is a volatility indicator normalized by close price developed by John Welles Wilder Jr."
        >
          info
        </span>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
    </div>
  );
};

export default Presenter;
