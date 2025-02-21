import { useAtomValue } from 'jotai';
import * as gState from '../../controllers/data/states';
import { useGetCompanies } from '../../controllers/net/company';
import styles from './search.module.scss';
import {
  useDeleteAllRecentClick,
  useLoadRecentSearchTabs,
  useSearchInputChange,
} from './searchInteractor';
import Card from './searchViewCompanyCard';

const Presenter = () => {
  useLoadRecentSearchTabs();

  const uuid = crypto.randomUUID();
  const onSearchInputChange = useSearchInputChange();
  const onDeleteAllRecentClick = useDeleteAllRecentClick();

  const searchInput = useAtomValue(gState.searchInput);
  const recentSearchTabs = useAtomValue(gState.recentSearchTabs);
  const { data } = useGetCompanies();

  return (
    <section className={styles.container}>
      <div className={styles.searchInputContainer}>
        <div className={styles.searchInputWrapper}>
          <div className={styles.searchIcon}>
            <i className="fa-solid fa-magnifying-glass"></i>
          </div>
          <input
            type="search"
            id="searchCompany"
            className={styles.searchInput}
            value={searchInput}
            placeholder="Search the company..."
            onChange={onSearchInputChange}
          />
        </div>
      </div>

      <div className={styles.titleWrapper}>
        <h3 className={styles.title}>Recent Search Results</h3>
        <div className={styles.deleteAllRecentBtn} onClick={onDeleteAllRecentClick}>
          Delete All
        </div>
      </div>
      <ul className={styles.companyList}>
        {recentSearchTabs.length ? (
          recentSearchTabs.map((tab) => (
            <Card key={`recent-${tab.company.codePrice}`} data={tab.company} uuid={tab.uuid} />
          ))
        ) : (
          <div className={styles.placeholder}>None</div>
        )}
      </ul>
      <div className={styles.division}></div>
      <h3 className={styles.title}>Search Results</h3>
      <ul className={styles.companyList}>
        {data && data.length ? (
          data.map((company) => (
            <Card key={`search-${company.codePrice}`} data={company} uuid={uuid} />
          ))
        ) : (
          <div className={styles.placeholder}>None</div>
        )}
      </ul>
    </section>
  );
};

export default Presenter;
