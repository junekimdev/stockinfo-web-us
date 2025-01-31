import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import { StateChaikin } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import styles from './cmf.module.scss';
import draw from './cmfFnDraw';
import { useDisplayCheckboxChange } from './cmfInteractor';
import { CmfStateDisplay } from './cmfState';

const Presenter = (props: { req: TypePriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  const { data } = useGetPrices(req);
  const dataChaikin = useAtomValue(StateChaikin(req));
  const display = useAtomValue(CmfStateDisplay);

  const onNoSignalZoneCheckboxChange = useDisplayCheckboxChange('noSignalZone');

  const chartTitle = `${req.type} CMF`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  const noSignalZoneInputID = `${chartID}-noSignalZone`;

  useEffect(() => {
    if (dataChaikin.length) {
      draw(chartID, dataChaikin.slice(-max), display, marginLeft);
    }
  }, [chartID, marginLeft, max, data, dataChaikin, display]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="CMF(Chaikin Money Flow) is volumetric trend indicator developed by Marc Chaikin: CMF (20)"
        >
          info
        </span>
        <h5>CMF &gt; 0: buying pressure is stronger,</h5>
        <h5>CMF &lt; 0: selling pressure is stronger</h5>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
      <div className={styles.displaySelectorWrapper} onClick={(e) => e.stopPropagation()}>
        <div className={styles.displaySelector} title="-0.05 < No Singal Zone for CMF < 0.05">
          <input
            type="checkbox"
            name={noSignalZoneInputID}
            id={noSignalZoneInputID}
            checked={display.noSignalZone}
            onChange={onNoSignalZoneCheckboxChange}
          />
          <label htmlFor={noSignalZoneInputID}>No Singal Zone</label>
        </div>
      </div>
    </div>
  );
};

export default Presenter;
