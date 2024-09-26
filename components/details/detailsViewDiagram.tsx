import { useRecoilValue } from 'recoil';
import { StateCurrentTab } from '../../controllers/data/states';
import { TypePriceRequest } from '../../controllers/data/types';
import { useGetEdgarStatement } from '../../controllers/net/edgar';
import { useGetPricesLatest } from '../../controllers/net/price';
import { shortenNumMillion } from '../../controllers/number';
import styles from './details.module.scss';

const getRatioString = (n: number) => {
  return (Math.round(n * 10) / 10).toFixed(1);
};

const View = () => {
  const { company } = useRecoilValue(StateCurrentTab);
  const req: TypePriceRequest = { code: company.code, type: 'latest' };
  const { data } = useGetEdgarStatement(company.cik);
  const prices = useGetPricesLatest(req);
  const latestPrice = prices.data?.[0].close ?? 0;
  const cap = latestPrice * (data?.outstandingStock[0]?.value ?? 0);
  const net = data?.netIncome[0]?.value ?? 0;
  const equ = data?.equity[0]?.value ?? 0;

  return (
    <div className={styles.diagram}>
      <div className={styles.diagramWrapper}>
        <div className={styles.diagramMarketCap}>
          <h5>Market Cap (시가총액)</h5>
          <span>{cap ? shortenNumMillion(cap) : undefined}</span>
        </div>
        <div className={styles.diagramEquity}>
          <h5>Equity (자본)</h5>
          <span>{shortenNumMillion(equ)}</span>
        </div>
        <div className={styles.diagramNetIncome}>
          <h5>Net Income (순이익)</h5>
          <span>{shortenNumMillion(net)}</span>
        </div>
        <div className={styles.diagramPBR}>
          <h5>PBR</h5>
          <span>{cap && equ ? `${getRatioString(cap / equ)} x` : undefined}</span>
        </div>
        <div className={styles.diagramPER}>
          <h5>PER</h5>
          <span>{cap && net ? `${getRatioString(cap / net)} x` : undefined}</span>
        </div>
        <div className={styles.diagramROE}>
          <h5>ROE</h5>
          <span>{net && equ ? `${getRatioString((net / equ) * 100)} %` : undefined}</span>
        </div>
      </div>
    </div>
  );
};

export default View;
