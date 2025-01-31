import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { StateMacd } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './macd.module.scss';
import draw from './macdFnDraw';
import { useDisplayCheckboxChange, useMacd } from './macdInteractor';
import { MacdStateDisplay } from './macdState';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;

  useMacd(req);
  const { data } = useGetPrices(req);
  const dataMacd = useAtomValue(StateMacd(req));
  const display = useAtomValue(MacdStateDisplay);

  const onMacdCheckboxChange = useDisplayCheckboxChange('MACD');
  const onSignalCheckboxChange = useDisplayCheckboxChange('signal');
  const onHistogramCheckboxChange = useDisplayCheckboxChange('histogram');

  const chartTitle = `${req.type} MACD`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  const macdInputID = `${chartID}-MACD`;
  const signalInputID = `${chartID}-signal`;
  const histogramInputID = `${chartID}-histogram`;

  useEffect(() => {
    if (dataMacd.length) {
      draw(chartID, dataMacd.slice(-max), display, marginLeft);
    }
  }, [chartID, marginLeft, max, data, dataMacd, display]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="MACD(Moving Average Convergence/Divergence) is a momentum oscillator developed by Gerald Appel"
        >
          info
        </span>
        <h5>MACD &gt; 0: Upside momentum is increasing,</h5>
        <h5>MACD &lt; 0: Downside momentum is increasing</h5>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
      <div className={styles.displaySelectorWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.displaySelector} title="MACD (12,26)">
          <input
            type="checkbox"
            name={macdInputID}
            id={macdInputID}
            checked={display.MACD}
            onChange={onMacdCheckboxChange}
          />
          <label htmlFor={macdInputID}>MACD</label>
        </div>
        <div className={styles.displaySelector} title="Signal (9)">
          <input
            type="checkbox"
            name={signalInputID}
            id={signalInputID}
            checked={display.signal}
            onChange={onSignalCheckboxChange}
          />
          <label htmlFor={signalInputID}>Signal</label>
        </div>
        <div className={styles.displaySelector} title="Histogram: (MACD - Signal) scaled up by 2x">
          <input
            type="checkbox"
            name={histogramInputID}
            id={histogramInputID}
            checked={display.histogram}
            onChange={onHistogramCheckboxChange}
          />
          <label htmlFor={histogramInputID}>Histogram 2x</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
