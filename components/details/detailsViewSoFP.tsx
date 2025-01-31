import { useAtomValue } from 'jotai';
import { StateCurrentTab } from '../../controllers/data/states';
import { useGetEdgarStatement } from '../../controllers/net/edgar';
import { shortenNumMillion } from '../../controllers/number';
import styles from './details.module.scss';

const getLiabilitiesRatio = (liabilities?: number, equity?: number) => {
  if (!liabilities || !equity) return;
  const n = Math.round((liabilities / equity) * 1000) / 10;
  return n.toFixed(1);
};

const View = () => {
  const { company } = useAtomValue(StateCurrentTab);
  const { data } = useGetEdgarStatement(company.cik);
  const assets = data?.assets ?? [];
  const equity = data?.equity ?? [];
  const liabilities = data?.liabilities ?? [];
  const ratioCur = getLiabilitiesRatio(liabilities[0]?.value, equity[0]?.value);
  const ratio1stPrior = getLiabilitiesRatio(liabilities[1]?.value, equity[1]?.value);
  const ratio2ndPrior = getLiabilitiesRatio(liabilities[2]?.value, equity[2]?.value);

  return (
    <div className={styles.tableContainer}>
      <h2>
        Statement of Financial Position
        <br />
        (재무상태표)
      </h2>
      <table>
        <colgroup>
          <col span={1} />
          <col span={1} className={styles.currentTerm} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">{`Current (${assets[0]?.date.getFullYear()})`}</th>
            <th scope="col">Prior</th>
            <th scope="col">2nd Prior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              Assets
              <br />
              (자산)
            </th>
            <td>{shortenNumMillion(assets[0]?.value)}</td>
            <td>{shortenNumMillion(assets[1]?.value)}</td>
            <td>{shortenNumMillion(assets[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Liabilities
              <br />
              (부채)
            </th>
            <td>{shortenNumMillion(liabilities[0]?.value)}</td>
            <td>{shortenNumMillion(liabilities[1]?.value)}</td>
            <td>{shortenNumMillion(liabilities[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Equity
              <br />
              (자본)
            </th>
            <td>{shortenNumMillion(equity[0]?.value)}</td>
            <td>{shortenNumMillion(equity[1]?.value)}</td>
            <td>{shortenNumMillion(equity[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Debt Ratio
              <br />
              (부채비율)
            </th>
            <td>{ratioCur ? `${ratioCur} %` : undefined}</td>
            <td>{ratio1stPrior ? `${ratio1stPrior} %` : undefined}</td>
            <td>{ratio2ndPrior ? `${ratio2ndPrior} %` : undefined}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default View;
