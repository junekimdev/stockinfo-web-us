import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useCheckboxChange } from '../../controllers/chart';
import {
  StatePriceBollingerBands,
  StatePriceDisplays,
  StatePriceHeikinAshi,
  StatePriceSAR,
} from '../../controllers/data/states';
import { TypeChart, TypePriceRequest } from '../../controllers/data/types';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './heikinAshi.module.scss';
import draw from './heikinAshiFnDraw';
import { useHeikinAshi } from './heikinAshiInteractor';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  useHeikinAshi(req);

  const chartType: TypeChart = 'heikin-aski';
  const { data } = useGetPricesLatest({ code: req.code, type: 'latest' });
  const dataHeikinAshi = useRecoilValue(StatePriceHeikinAshi(req));
  const dataSar = useRecoilValue(StatePriceSAR(req));
  const dataBands = useRecoilValue(StatePriceBollingerBands(req));
  const display = useRecoilValue(StatePriceDisplays({ code: req.code, type: chartType }));

  const chartTitle = `${req.type} Heikin-Ashi`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;
  const latestPriceInputID = `${chartID}-LatestPrice`;
  const sarInputID = `${chartID}-ParabolicSAR`;
  const bollingerInputID = `${chartID}-BollingerBands`;

  const onLatestPriceCheckboxChange = useCheckboxChange(req.code, chartType, 'LatestPrice');
  const onSarCheckboxChange = useCheckboxChange(req.code, chartType, 'ParabolicSAR');
  const onBollingerCheckboxChange = useCheckboxChange(req.code, chartType, 'BollingerBands');

  useEffect(() => {
    if (dataHeikinAshi.length) {
      draw(
        chartID,
        dataHeikinAshi.slice(-max),
        dataSar.slice(-max),
        dataBands.slice(-max),
        display,
        marginLeft,
        data?.[0],
      );
    }
  }, [chartID, marginLeft, max, dataHeikinAshi, dataSar, dataBands, display, data]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="Heikin-Ashi means 'average bar' in Japanese; it represents the average pace of prices"
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
        <div className={styles.displaySelector} title="Parabolic SAR (0.2,0.01)">
          <input
            type="checkbox"
            name={sarInputID}
            id={sarInputID}
            checked={display.ParabolicSAR}
            onChange={onSarCheckboxChange}
          />
          <label htmlFor={sarInputID}>Parabolic SAR</label>
        </div>
        <div className={styles.displaySelector} title="Bollinger Bands (20,2)">
          <input
            type="checkbox"
            name={bollingerInputID}
            id={bollingerInputID}
            checked={display.BollingerBands}
            onChange={onBollingerCheckboxChange}
          />
          <label htmlFor={bollingerInputID}>Bollinger Bands</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
