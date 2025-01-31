import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { StateAdx } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './adx.module.scss';
import draw from './adxFnDraw';
import { useAdx, useDisplayCheckboxChange } from './adxInteractor';
import { AdxStateDisplay } from './adxState';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;

  useAdx(req);
  const { data } = useGetPrices(req);
  const dataAdx = useAtomValue(StateAdx(req));
  const display = useAtomValue(AdxStateDisplay);

  const onADXCheckboxChange = useDisplayCheckboxChange('ADX');
  const onPdiCheckboxChange = useDisplayCheckboxChange('pDI');
  const onNdiCheckboxChange = useDisplayCheckboxChange('nDI');
  const onBuyCheckboxChange = useDisplayCheckboxChange('buy');
  const onSellCheckboxChange = useDisplayCheckboxChange('sell');
  const onConfirmCheckboxChange = useDisplayCheckboxChange('trendConfirm');

  const chartTitle = `${req.type} ADX`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  const trendConfirmedInputID = `${chartID}-trendConfirmed`;
  const adxInputID = `${chartID}-ADX`;
  const pdiInputID = `${chartID}-pDI`;
  const ndiInputID = `${chartID}-nDI`;
  const buyInputID = `${chartID}-buy`;
  const sellInputID = `${chartID}-sell`;

  useEffect(() => {
    if (dataAdx.length) {
      draw(chartID, dataAdx.slice(-max), display, marginLeft);
    }
  }, [chartID, marginLeft, max, data, dataAdx, display]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="ADX(Average Directional Index) is a trend strength indicator developed by John Welles Wilder Jr."
        >
          info
        </span>
        <h5>ADX &gt; 20 : A new trend may emerge,</h5>
        <h5>ADX &gt; 25 : Confirmation of the trend,</h5>
        <h5>ADX &gt; 40 : Strong trend</h5>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
      <div className={styles.displaySelectorWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.displaySelector} title="ADX (14)">
          <input
            type="checkbox"
            name={adxInputID}
            id={adxInputID}
            checked={display.ADX}
            onChange={onADXCheckboxChange}
          />
          <label htmlFor={adxInputID}>ADX</label>
        </div>
        <div className={styles.displaySelector} title="Positive Directional Indicator">
          <input
            type="checkbox"
            name={pdiInputID}
            id={pdiInputID}
            checked={display.pDI}
            onChange={onPdiCheckboxChange}
          />
          <label htmlFor={pdiInputID}>+DI</label>
        </div>
        <div className={styles.displaySelector} title="Negative Directional Indicator">
          <input
            type="checkbox"
            name={ndiInputID}
            id={ndiInputID}
            checked={display.nDI}
            onChange={onNdiCheckboxChange}
          />
          <label htmlFor={ndiInputID}>-DI</label>
        </div>
        <div className={styles.displaySelector} title="Buy Signal (+DI crosses above -DI)">
          <input
            type="checkbox"
            name={buyInputID}
            id={buyInputID}
            checked={display.buy}
            onChange={onBuyCheckboxChange}
          />
          <label htmlFor={buyInputID}>Buy Signal</label>
        </div>
        <div className={styles.displaySelector} title="Sell Signal (+DI crosses below -DI)">
          <input
            type="checkbox"
            name={sellInputID}
            id={sellInputID}
            checked={display.sell}
            onChange={onSellCheckboxChange}
          />
          <label htmlFor={sellInputID}>Sell Signal</label>
        </div>
        <div className={styles.displaySelector} title="Trend Confirmed above 25">
          <input
            type="checkbox"
            name={trendConfirmedInputID}
            id={trendConfirmedInputID}
            checked={display.trendConfirm}
            onChange={onConfirmCheckboxChange}
          />
          <label htmlFor={trendConfirmedInputID}>Trend Confirm</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
