import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { StatePricePercentChange } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices, useGetPricesLatest } from '../../controllers/net/price';
import styles from './percentChange.module.scss';
import draw from './percentChangeFnDraw';
import { useDisplayCheckboxChange, usePricePercentChange } from './percentChangeInteractor';
import { PercentChangeStateDisplay } from './percentChangeState';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  usePricePercentChange(req);

  const { data } = useGetPrices(req);
  const { data: latestPriceData } = useGetPricesLatest({ code: req.code, type: 'latest' });
  const dataPercentChange = useAtomValue(StatePricePercentChange(req));
  const display = useAtomValue(PercentChangeStateDisplay);

  const chartTitle = `${req.type} price percent change`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;
  const latestPriceInputID = `${chartID}-LatestPrice`;

  const onLatestPriceCheckboxChange = useDisplayCheckboxChange('LatestPrice');

  const lastestPercentChange =
    data?.length && latestPriceData
      ? (100 * latestPriceData.close) / data[data.length - 1].close - 100
      : undefined;

  useEffect(() => {
    if (data?.length) {
      draw(chartID, dataPercentChange.slice(-max), display, marginLeft, lastestPercentChange);
    }
  }, [chartID, marginLeft, max, data, dataPercentChange, display, lastestPercentChange]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="price is adjusted to accommodate changes of stock amount"
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
