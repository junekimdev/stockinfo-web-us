import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { useInputChange } from '../../controllers/data/hooks';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './macdV.module.scss';
import draw from './macdVFnDraw';
import { useMacdV } from './macdVInteractor';
import * as mState from './macdVState';

const Presenter = (props: { req: gType.PriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;

  useMacdV(req);
  const { data } = useGetPrices(req);
  const dataMacdV = useAtomValue(gState.macdV(req));
  const display = useAtomValue(mState.display);

  const onMacdVCheckboxChange = useInputChange(mState.display, 'MACDV');
  const onSignalCheckboxChange = useInputChange(mState.display, 'signal');
  const onHistogramCheckboxChange = useInputChange(mState.display, 'histogram');
  const onOverboughtCheckboxChange = useInputChange(mState.display, 'overbought');
  const onOversoldCheckboxChange = useInputChange(mState.display, 'oversold');
  const onUpsideMomentumCheckboxChange = useInputChange(mState.display, 'upsideMomentum');
  const onDownsideMomentumCheckboxChange = useInputChange(mState.display, 'downsideMomentum');

  const chartTitle = `${req.type} MACD-V`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  const macdVInputID = `${chartID}-MACDV`;
  const signalInputID = `${chartID}-signal`;
  const histogramInputID = `${chartID}-histogram`;
  const overboughtInputID = `${chartID}-overbought`;
  const oversoldInputID = `${chartID}-oversold`;
  const upsideMomentumInputID = `${chartID}-upsideMomentum`;
  const downsideMomentumInputID = `${chartID}-downsideMomentum`;

  useEffect(() => {
    if (dataMacdV.length) {
      draw(chartID, dataMacdV.slice(-max), display, marginLeft);
    }
  }, [chartID, marginLeft, max, data, dataMacdV, display]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="MACD-V(Moving Average Convergence/Divergence - Volatility) is a momentum oscillator normalized by volatility(ATR) developed by Alex Spiroglou"
        >
          info
        </span>
        <h5>MACD-V &lt; -150: Oversold,</h5>
        <h5>MACD-V &lt; -50: Strong downside momentum,</h5>
        <h5>MACD-V &gt; 50: Strong upside momentum,</h5>
        <h5>MACD-V &gt; 150: Overbought</h5>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
      <div className={styles.displaySelectorWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.displaySelector} title="MACD-V (12,26)">
          <input
            type="checkbox"
            name={macdVInputID}
            id={macdVInputID}
            checked={display.MACDV}
            onChange={onMacdVCheckboxChange}
          />
          <label htmlFor={macdVInputID}>MACD-V</label>
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
        <div
          className={styles.displaySelector}
          title="Histogram: (MACD-V - Signal) scaled up by 2x"
        >
          <input
            type="checkbox"
            name={histogramInputID}
            id={histogramInputID}
            checked={display.histogram}
            onChange={onHistogramCheckboxChange}
          />
          <label htmlFor={histogramInputID}>Histogram 2x</label>
        </div>
        <div className={styles.displaySelector} title="Overbought: MACD-V > 150">
          <input
            type="checkbox"
            name={overboughtInputID}
            id={overboughtInputID}
            checked={display.overbought}
            onChange={onOverboughtCheckboxChange}
          />
          <label htmlFor={overboughtInputID}>Overbought</label>
        </div>
        <div className={styles.displaySelector} title="Oversold: MACD-V < -150">
          <input
            type="checkbox"
            name={oversoldInputID}
            id={oversoldInputID}
            checked={display.oversold}
            onChange={onOversoldCheckboxChange}
          />
          <label htmlFor={oversoldInputID}>Oversold</label>
        </div>
        <div className={styles.displaySelector} title="Upside Momentum: 50 < MACD-V < 150">
          <input
            type="checkbox"
            name={upsideMomentumInputID}
            id={upsideMomentumInputID}
            checked={display.upsideMomentum}
            onChange={onUpsideMomentumCheckboxChange}
          />
          <label htmlFor={upsideMomentumInputID}>Upside</label>
        </div>
        <div className={styles.displaySelector} title="Downside Momentum: -150 < MACD-V < -50">
          <input
            type="checkbox"
            name={downsideMomentumInputID}
            id={downsideMomentumInputID}
            checked={display.downsideMomentum}
            onChange={onDownsideMomentumCheckboxChange}
          />
          <label htmlFor={downsideMomentumInputID}>Downside</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
