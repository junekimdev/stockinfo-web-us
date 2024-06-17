import { useRecoilValue } from 'recoil';
import { getMarginLeft } from '../../controllers/chart';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import HeikinAshi from '../heikinAshi';
import Price from '../price';
import Volume from '../volume';
import styles from './charts.module.scss';
import {
  useBollinger,
  useHeikinAshi,
  useHeikinAshiSmoothed,
  useRulerOnClick,
  useSAR,
} from './chartsInteractor';
import Placeholder from './chartsViewPlaceholder';

const Presenter = () => {
  const { company, mainType } = useRecoilValue(StateCurrentTab);
  const req: TypePriceRequest = { code: company.code, type: mainType };
  const priceData = useGetPrices(req);
  const marginLeft = getMarginLeft(priceData.data);
  const rulerOnClick = useRulerOnClick();
  useBollinger(req);
  useHeikinAshi(req);
  useHeikinAshiSmoothed(req);
  useSAR(req);

  return (
    <section className={styles.container} onClick={rulerOnClick}>
      {priceData.data && priceData.data.length ? (
        <>
          <Price req={req} marginLeft={marginLeft} />
          <HeikinAshi req={req} marginLeft={marginLeft} />
          <Volume req={req} marginLeft={marginLeft} />
          <div className={styles.ruler}></div>
        </>
      ) : (
        <Placeholder />
      )}
    </section>
  );
};

export default Presenter;
