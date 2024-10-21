import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import { StateStochastic, StateStochasticDisplay } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './stochastic.module.scss';
import draw from './stochasticFnDraw';
import { useDisplayCheckboxChange, useStochastic } from './stochasticInteractor';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;

  useStochastic(req);
  const { data } = useGetPrices(req);
  const dataStochastic = useRecoilValue(StateStochastic(req));
  const display = useRecoilValue(StateStochasticDisplay);

  const onFullKCheckboxChange = useDisplayCheckboxChange('fullK');
  const onFullDCheckboxChange = useDisplayCheckboxChange('fullD');
  const onOversoldCheckboxChange = useDisplayCheckboxChange('oversold');
  const onOverboughtCheckboxChange = useDisplayCheckboxChange('overbought');
  const onConfirmCheckboxChange = useDisplayCheckboxChange('trendConfirm');

  const chartTitle = `${req.type} SO`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  const fullKInputID = `${chartID}-fullK`;
  const fullDInputID = `${chartID}-fullD`;
  const overboughtInputID = `${chartID}-overbought`;
  const oversoldInputID = `${chartID}-oversold`;
  const confirmInputID = `${chartID}-trendConfirm`;

  useEffect(() => {
    if (dataStochastic.length) {
      draw(chartID, dataStochastic.slice(-max), display, marginLeft);
    }
  }, [chartID, marginLeft, max, data, dataStochastic, display]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="SO(Stochastic Oscillator) is a momentum indicator that shows the speed and momentum of price movement developed by George C. Lane"
        >
          info
        </span>
        <h5>SO &lt; 20 : Oversold,</h5>
        <h5>SO = 50 : Confirmation of the trend,</h5>
        <h5>SO &gt; 80 : Overbought</h5>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
      <div className={styles.displaySelectorWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.displaySelector} title="Full %K (14,3,3)">
          <input
            type="checkbox"
            name={fullKInputID}
            id={fullKInputID}
            checked={display.fullK}
            onChange={onFullKCheckboxChange}
          />
          <label htmlFor={fullKInputID}>Full %K</label>
        </div>
        <div className={styles.displaySelector} title="Full %D (14,3,3)">
          <input
            type="checkbox"
            name={fullDInputID}
            id={fullDInputID}
            checked={display.fullD}
            onChange={onFullDCheckboxChange}
          />
          <label htmlFor={fullDInputID}>Full %D</label>
        </div>
        <div className={styles.displaySelector} title="Overbought above 80">
          <input
            type="checkbox"
            name={overboughtInputID}
            id={overboughtInputID}
            checked={display.overbought}
            onChange={onOverboughtCheckboxChange}
          />
          <label htmlFor={overboughtInputID}>Overbought</label>
        </div>
        <div className={styles.displaySelector} title="Oversold below 20">
          <input
            type="checkbox"
            name={oversoldInputID}
            id={oversoldInputID}
            checked={display.oversold}
            onChange={onOversoldCheckboxChange}
          />
          <label htmlFor={oversoldInputID}>Oversold</label>
        </div>
        <div className={styles.displaySelector} title="Trend Confirmed above 50">
          <input
            type="checkbox"
            name={confirmInputID}
            id={confirmInputID}
            checked={display.trendConfirm}
            onChange={onConfirmCheckboxChange}
          />
          <label htmlFor={confirmInputID}>Trend Confirm</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
