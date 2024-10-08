import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { useCheckboxChange } from '../../controllers/chart';
import {
  StateChartOverlays,
  StatePriceBollingerBands,
  StatePriceHeikinAshi,
  StatePriceSAR,
} from '../../controllers/data/states';
import { TypeChart, TypePriceRequest } from '../../controllers/data/types';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './heikinAshi.module.scss';
import draw from './heikinAshiFnDraw';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  const chartType: TypeChart = 'heikin-aski';
  const { data } = useGetPricesLatest({ code: req.code, type: 'latest' });
  const dataHeikinAshi = useRecoilValue(StatePriceHeikinAshi(req));
  const dataSar = useRecoilValue(StatePriceSAR(req));
  const dataBands = useRecoilValue(StatePriceBollingerBands(req));
  const overlays = useRecoilValue(StateChartOverlays({ code: req.code, type: chartType }));

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
        overlays,
        marginLeft,
        data?.[0],
      );
    }
  }, [chartID, marginLeft, max, dataHeikinAshi, dataSar, dataBands, overlays, data]);

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
      <div className={styles.overlaySelectorWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.overlaySelector} title="Latest Price">
          <input
            type="checkbox"
            name={latestPriceInputID}
            id={latestPriceInputID}
            checked={overlays.LatestPrice}
            onChange={onLatestPriceCheckboxChange}
          />
          <label htmlFor={latestPriceInputID}>Latest Price</label>
        </div>
        <div className={styles.overlaySelector} title="Parabolic SAR (0.2,0.01)">
          <input
            type="checkbox"
            name={sarInputID}
            id={sarInputID}
            checked={overlays.ParabolicSAR}
            onChange={onSarCheckboxChange}
          />
          <label htmlFor={sarInputID}>Parabolic SAR</label>
        </div>
        <div className={styles.overlaySelector} title="Bollinger Bands (20,2)">
          <input
            type="checkbox"
            name={bollingerInputID}
            id={bollingerInputID}
            checked={overlays.BollingerBands}
            onChange={onBollingerCheckboxChange}
          />
          <label htmlFor={bollingerInputID}>Bollinger Bands</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
