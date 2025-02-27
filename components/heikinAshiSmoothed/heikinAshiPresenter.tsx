import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useInputChange } from '../../controllers/data/hooks';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './heikinAshi.module.scss';
import draw from './heikinAshiFnDraw';
import { useHeikinAshiSmoothed } from './heikinAshiInteractor';
import * as mState from './heikinAshiState';

const Presenter = (props: { req: gType.PriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  useHeikinAshiSmoothed(req);

  const { data } = useGetPricesLatest({ code: req.code, type: 'latest' });
  const dataHeikinAshi = useAtomValue(gState.priceHeikinAshiSmoothed(req));
  const display = useAtomValue(mState.display);

  const chartTitle = `${req.type} Heikin-Ashi Smoothed`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;
  const latestPriceInputID = `${chartID}-LatestPrice`;

  const onLatestPriceCheckboxChange = useInputChange(mState.display, 'LatestPrice');

  useEffect(() => {
    if (dataHeikinAshi.length) {
      draw(chartID, dataHeikinAshi.slice(-max), display, marginLeft, data);
    }
  }, [chartID, marginLeft, max, dataHeikinAshi, display, data]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="Heikin-Ashi smoothed by double EMA: EMA(EMA(Heikin-Ashi,10),10)"
        >
          info
        </span>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
      <div className={styles.displaySelectorWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.displaySelector} title="Latest Price">
          <input
            type="checkbox"
            name={latestPriceInputID}
            id={latestPriceInputID}
            checked={display.LatestPrice}
            onChange={onLatestPriceCheckboxChange}
          />
          <label htmlFor={latestPriceInputID}>Latest Price</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
