import { useRecoilValue } from 'recoil';
import { getMarginLeft } from '../../controllers/chart';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetPrices } from '../../controllers/net/price';
import Adx from '../adx';
import Atrp from '../atrp';
import Chaikin from '../chaikin';
import Cmf from '../cmf';
import HeikinAshi from '../heikinAshi';
import HeikinAshiSmoothed from '../heikinAshiSmoothed';
import Macd from '../macd';
import MacdV from '../macdV';
import PercentChange from '../percentChange';
import Price from '../price';
import Rsi from '../rsi';
import Stochastic from '../stochastic';
import Volume from '../volume';
import styles from './charts.module.scss';
import { useBollinger, useChaikin, useRulerOnClick, useSAR } from './chartsInteractor';
import Placeholder from './chartsViewPlaceholder';

const Presenter = () => {
  const { company, mainType } = useRecoilValue(StateCurrentTab);
  const req: TypePriceRequest = { code: company.code, type: mainType };
  const { data } = useGetPrices(req);
  const marginLeft = getMarginLeft(data);
  const rulerOnClick = useRulerOnClick();
  useBollinger(req);
  useSAR(req);
  useChaikin(req);

  return (
    <section className={styles.container} onClick={rulerOnClick}>
      {data?.length ? (
        <>
          <Price req={req} marginLeft={marginLeft} />
          <HeikinAshi req={req} marginLeft={marginLeft} />
          <Rsi req={req} marginLeft={marginLeft} />
          <Macd req={req} marginLeft={marginLeft} />
          <MacdV req={req} marginLeft={marginLeft} />
          <Stochastic req={req} marginLeft={marginLeft} />
          <HeikinAshiSmoothed req={req} marginLeft={marginLeft} />
          <Adx req={req} marginLeft={marginLeft} />
          <PercentChange req={req} marginLeft={marginLeft} />
          <Atrp req={req} marginLeft={marginLeft} />
          <Cmf req={req} marginLeft={marginLeft} />
          <Chaikin req={req} marginLeft={marginLeft} />
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
