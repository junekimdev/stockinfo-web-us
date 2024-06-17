export const placeholderUrl = 'https://jsonplaceholder.typicode.com/posts';

const API_URL = process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:4000';
export const COMPANIES_URL = API_URL + '/v1/tickers';
export const PRICES_URL = API_URL + '/v1/prices_us';
export const EDGAR_URL = API_URL + '/v1/edgar';
export const EDGAR_VIEWER_LINK = 'https://www.sec.gov/edgar/browse/?CIK=';

export const DIFF_NATION_URL = process.env.NEXT_PUBLIC_DIFF_NATION_URL ?? 'http://localhost:3000';

export const LOCAL_STORAGE_KEY_COMPANY_TABS = 'stockinfo-us-company-tabs';
export const LOCAL_STORAGE_KEY_RECENT_SEARCH_TABS = 'stockinfo-us-recent-search-tabs';
