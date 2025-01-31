import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { StateRsi } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './rsi.module.scss';
import draw from './rsiFnDraw';
import { useDisplayCheckboxChange, useRsi } from './rsiInteractor';
import { RsiStateDisplay } from './rsiState';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;

  useRsi(req);
  const { data } = useGetPrices(req);
  const dataRsi = useAtomValue(StateRsi(req));
  const display = useAtomValue(RsiStateDisplay);

  const onOversoldLineCheckboxChange = useDisplayCheckboxChange('oversold');
  const onOverboughtLineCheckboxChange = useDisplayCheckboxChange('overbought');

  const chartTitle = `${req.type} RSI`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  const overboughtInputID = `${chartID}-overbought`;
  const oversoldInputID = `${chartID}-oversold`;

  useEffect(() => {
    if (dataRsi.length) {
      draw(chartID, dataRsi.slice(-max), display, marginLeft);
    }
  }, [chartID, marginLeft, max, data, dataRsi, display]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="RSI(Relative Strength Index) is a momentum oscillator developed by John Welles Wilder Jr. : RSI (14)"
        >
          info
        </span>
        <h5>RSI &lt; 30 : Oversold,</h5>
        <h5>RSI &gt; 70 : Overbought</h5>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
      <div className={styles.displaySelectorWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.displaySelector} title="Overbought above 70">
          <input
            type="checkbox"
            name={overboughtInputID}
            id={overboughtInputID}
            checked={display.overbought}
            onChange={onOverboughtLineCheckboxChange}
          />
          <label htmlFor={overboughtInputID}>Overbought</label>
        </div>
        <div className={styles.displaySelector} title="Oversold below 30">
          <input
            type="checkbox"
            name={oversoldInputID}
            id={oversoldInputID}
            checked={display.oversold}
            onChange={onOversoldLineCheckboxChange}
          />
          <label htmlFor={oversoldInputID}>Oversold</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
