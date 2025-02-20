import { useAtomValue } from 'jotai';
import * as gState from '../../controllers/data/states';
import { useGetEdgarStatement } from '../../controllers/net/edgar';
import { shortenNumMillion } from '../../controllers/number';
import styles from './details.module.scss';

const View = () => {
  const { company } = useAtomValue(gState.currentTab);
  const { data } = useGetEdgarStatement(company.code);
  const cashflowOperating = data?.operatingCashFlow ?? [];
  const cashflowInvesting = data?.investingCashFlow ?? [];
  const cashflowFinancing = data?.financingCashFlow ?? [];
  return (
    <div className={styles.tableContainer}>
      <h2>
        Statement of Cash Flows
        <br />
        (현금흐름표)
      </h2>
      <table>
        <colgroup>
          <col span={1} />
          <col span={1} className={styles.currentTerm} />
        </colgroup>
        <thead>
          <tr>
            <th scope="col"></th>
            <th scope="col">{`Current (${cashflowOperating[0]?.date.getFullYear()})`}</th>
            <th scope="col">Prior</th>
            <th scope="col">2nd Prior</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <th scope="row">
              Operating Activities
              <br />
              (영업활동)
            </th>
            <td>{shortenNumMillion(cashflowOperating[0]?.value)}</td>
            <td>{shortenNumMillion(cashflowOperating[1]?.value)}</td>
            <td>{shortenNumMillion(cashflowOperating[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Investing Activities
              <br />
              (투자활동)
            </th>
            <td>{shortenNumMillion(cashflowInvesting[0]?.value)}</td>
            <td>{shortenNumMillion(cashflowInvesting[1]?.value)}</td>
            <td>{shortenNumMillion(cashflowInvesting[2]?.value)}</td>
          </tr>
          <tr>
            <th scope="row">
              Financing Activities
              <br />
              (재무활동)
            </th>
            <td>{shortenNumMillion(cashflowFinancing[0]?.value)}</td>
            <td>{shortenNumMillion(cashflowFinancing[1]?.value)}</td>
            <td>{shortenNumMillion(cashflowFinancing[2]?.value)}</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};

export default View;
