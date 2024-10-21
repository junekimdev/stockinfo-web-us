import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useCheckboxChange } from '../../controllers/chart';
import { StatePriceDisplays, StatePriceHeikinAshiSmoothed } from '../../controllers/data/states';
import { TypeChart, TypePriceRequest } from '../../controllers/data/types';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './heikinAshi.module.scss';
import draw from './heikinAshiFnDraw';
import { useHeikinAshiSmoothed } from './heikinAshiInteractor';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  useHeikinAshiSmoothed(req);

  const chartType: TypeChart = 'heikin-aski-smoothed';
  const { data } = useGetPricesLatest({ code: req.code, type: 'latest' });
  const dataHeikinAshi = useRecoilValue(StatePriceHeikinAshiSmoothed(req));
  const display = useRecoilValue(StatePriceDisplays({ code: req.code, type: chartType }));

  const chartTitle = `${req.type} Heikin-Ashi Smoothed`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;
  const latestPriceInputID = `${chartID}-LatestPrice`;

  const onLatestPriceCheckboxChange = useCheckboxChange(req.code, chartType, 'LatestPrice');

  useEffect(() => {
    if (dataHeikinAshi.length) {
      draw(chartID, dataHeikinAshi.slice(-max), display, marginLeft, data?.[0]);
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
