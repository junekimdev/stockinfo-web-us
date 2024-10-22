import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useCheckboxChange } from '../../controllers/chart';
import { StatePriceDisplays, StatePricePercentChange } from '../../controllers/data/states';
import { TypeChart, TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices, useGetPricesLatest } from '../../controllers/net/price';
import styles from './percentChange.module.scss';
import draw from './percentChangeFnDraw';
import { usePricePercentChange } from './percentChangeInteractor';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  usePricePercentChange(req);

  const chartType: TypeChart = 'percent-change';
  const { data } = useGetPrices(req);
  const { data: latestPriceData } = useGetPricesLatest({ code: req.code, type: 'latest' });
  const dataPercentChange = useRecoilValue(StatePricePercentChange(req));
  const display = useRecoilValue(StatePriceDisplays({ code: req.code, type: chartType }));

  const chartTitle = `${req.type} price percent change`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;
  const latestPriceInputID = `${chartID}-LatestPrice`;

  const onLatestPriceCheckboxChange = useCheckboxChange(req.code, chartType, 'LatestPrice');

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
