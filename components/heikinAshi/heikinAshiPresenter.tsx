import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useInputChange } from '../../controllers/data/hooks';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPricesLatest } from '../../controllers/net/price';
import styles from './heikinAshi.module.scss';
import draw from './heikinAshiFnDraw';
import { useHeikinAshi } from './heikinAshiInteractor';
import * as mType from './heikinAshiState';

const Presenter = (props: { req: gType.PriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  useHeikinAshi(req);

  const { data } = useGetPricesLatest({ code: req.code, type: 'latest' });
  const dataHeikinAshi = useAtomValue(gState.priceHeikinAshi(req));
  const dataSar = useAtomValue(gState.priceSAR(req));
  const dataBands = useAtomValue(gState.priceBollingerBands(req));
  const display = useAtomValue(mType.display);

  const chartTitle = `${req.type} Heikin-Ashi`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;
  const latestPriceInputID = `${chartID}-LatestPrice`;
  const sarInputID = `${chartID}-ParabolicSAR`;
  const bollingerInputID = `${chartID}-BollingerBands`;

  const onLatestPriceCheckboxChange = useInputChange(mType.display, 'LatestPrice');
  const onSarCheckboxChange = useInputChange(mType.display, 'ParabolicSAR');
  const onBollingerCheckboxChange = useInputChange(mType.display, 'BollingerBands');

  useEffect(() => {
    if (dataHeikinAshi.length) {
      draw(
        chartID,
        dataHeikinAshi.slice(-max),
        dataSar.slice(-max),
        dataBands.slice(-max),
        display,
        marginLeft,
        data,
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
