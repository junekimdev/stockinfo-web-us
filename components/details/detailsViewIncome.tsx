import { useAtomValue } from 'jotai';
import { StateCurrentTab } from '../../controllers/data/states';
import { useGetEdgarStatement } from '../../controllers/net/edgar';
import { shortenNumMillion } from '../../controllers/number';
import styles from './details.module.scss';

const getOperatingIncomeRatio = (operatingIncome?: number, revenue?: number) => {
  if (!operatingIncome || !revenue) return;
  const n = Math.round((operatingIncome / revenue) * 1000) / 10;
  return n.toFixed(1);
};

const View = () => {
  const { company } = useAtomValue(StateCurrentTab);
  const { data } = useGetEdgarStatement(company.cik);
  const operatingIncome = data?.operatingIncome ?? [];
  const revenue = data?.revenue ?? [];
  const netIncome = data?.netIncome ?? [];
  const comprehensiveIncome = data?.comprehensiveIncome ?? [];
  const ratioCur = getOperatingIncomeRatio(operatingIncome[0]?.value, revenue[0]?.value);
  const ratio1stPrior = getOperatingIncomeRatio(operatingIncome[1]?.value, revenue[1]?.value);
  const ratio2ndPrior = getOperatingIncomeRatio(operatingIncome[2]?.value, revenue[2]?.value);

  return (
    <div className={styles.tableContainer}>
      <h2>
        Statement of Income
        <br />
        (손익계산서)
      </h2>
      <table>
        <colgroup>
          <col span={1} />
          <col span={1} className={styles.currentTerm} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">{`Current (${revenue[0]?.date.getFullYear()})`}</th>
            <th scope="col">Prior</th>
            <th scope="col">2nd Prior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              Sales Revenue
              <br />
              (매출액)
            </th>
            <td>{shortenNumMillion(revenue[0]?.value)}</td>
            <td>{shortenNumMillion(revenue[1]?.value)}</td>
            <td>{shortenNumMillion(revenue[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Operating Income
              <br />
              (영업이익)
            </th>
            <td>{shortenNumMillion(operatingIncome[0]?.value)}</td>
            <td>{shortenNumMillion(operatingIncome[1]?.value)}</td>
            <td>{shortenNumMillion(operatingIncome[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Net Income
              <br />
              (순이익)
            </th>
            <td>{shortenNumMillion(netIncome[0]?.value)}</td>
            <td>{shortenNumMillion(netIncome[1]?.value)}</td>
            <td>{shortenNumMillion(netIncome[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Comprehensive Income
              <br />
              (포괄순이익)
            </th>
            <td>{shortenNumMillion(comprehensiveIncome[0]?.value)}</td>
            <td>{shortenNumMillion(comprehensiveIncome[1]?.value)}</td>
            <td>{shortenNumMillion(comprehensiveIncome[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Operating Income Ratio
              <br />
              (영업이익률)
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
