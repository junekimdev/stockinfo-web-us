import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { StatePriceBollingerBands, StatePriceSAR } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices, useGetPricesLatest } from '../../controllers/net/price';
import styles from './price.module.scss';
import draw from './priceFnDraw';
import { useDisplayCheckboxChange } from './priceInteractor';
import { PriceStateDisplay } from './priceState';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;

  const { data } = useGetPrices(req);
  const { data: latestPriceData } = useGetPricesLatest({ code: req.code, type: 'latest' });
  const dataSar = useAtomValue(StatePriceSAR(req));
  const dataBands = useAtomValue(StatePriceBollingerBands(req));
  const display = useAtomValue(PriceStateDisplay);

  const chartTitle = `${req.type} price`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;
  const latestPriceInputID = `${chartID}-LatestPrice`;
  const sarInputID = `${chartID}-ParabolicSAR`;
  const bollingerInputID = `${chartID}-BollingerBands`;

  const onLatestPriceCheckboxChange = useDisplayCheckboxChange('LatestPrice');
  const onSarCheckboxChange = useDisplayCheckboxChange('ParabolicSAR');
  const onBollingerCheckboxChange = useDisplayCheckboxChange('BollingerBands');

  useEffect(() => {
    if (data?.length) {
      draw(
        chartID,
        data.slice(-max),
        dataSar.slice(-max),
        dataBands.slice(-max),
        display,
        marginLeft,
        latestPriceData,
      );
    }
  }, [chartID, marginLeft, max, data, dataSar, dataBands, display, latestPriceData]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="price is adjusted only by the number of outstanding stocks; dividend is not considered"
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
