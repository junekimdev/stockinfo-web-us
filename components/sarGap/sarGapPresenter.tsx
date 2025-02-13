import { useAtomValue } from 'jotai';
import { useEffect } from 'react';
import * as gState from '../../controllers/data/states';
import * as gType from '../../controllers/data/types';
import styles from './sarGap.module.scss';
import draw from './sarGapFnDraw';

const Presenter = (props: { req: gType.PriceRequest; marginLeft: number; max?: number }) => {
  const { req, marginLeft, max = 120 } = props;
  const dataSar = useAtomValue(gState.priceSAR(req));

  const chartTitle = `${req.type} Parabolic SAR Gap`;
  const chartID = `${styles.chart}-${req.code}-${req.type}`;

  useEffect(() => {
    if (dataSar.length) {
      draw(chartID, dataSar.slice(-max), marginLeft);
    }
  }, [chartID, marginLeft, max, dataSar]);

  return (
    <div className={styles.chartContainer}>
      <div className={styles.chartTitle}>
        <h5>{chartTitle}</h5>
        <span
          className="material-symbols-outlined"
          title="Parabolic SAR Gap is a gap between Parabolic SAR and closest price range; developed by June Kim"
        >
          info
        </span>
      </div>
      <svg id={chartID} className={styles.chart}></svg>
    </div>
  );
};

export default Presenter;
