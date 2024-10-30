import Image from 'next/image';
import { ReactNode } from 'react';
import { useLoadCompanyTabs } from '../../controllers/data/hooks';
import { useGetPricesPrefetching } from '../../controllers/net/price';
import logoSrc from '../../public/assets/images/junekim_192x192.png';
import styles from './mainFrame.module.scss';
import Menu from './mainFrameViewMenu';
import Navbar from './mainFrameViewNavbar';

const Presenter = (props: { children?: ReactNode[] | ReactNode }) => {
  const { children } = props;
  useLoadCompanyTabs();
  useGetPricesPrefetching();
  const year = new Date().getFullYear();

  return (
    <main role="main" className={styles.main}>
      <Navbar />
      <Menu />
      <div className={styles.mainFrame}>
        {children}
        <footer className={styles.footer}>
          <div>Copyright &copy; {year === 2024 ? year : `2024-${year}`}</div>
          <div className={styles.author}>
            June Kim
            <Image src={logoSrc} alt="logo" width={24} height={24} />
          </div>
          <div>All rights are reserved.</div>
        </footer>
      </div>
    </main>
  );
};

export default Presenter;
