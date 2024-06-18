import { useEffect } from 'react';
import { useRecoilValue } from 'recoil';
import Chart from '../components/charts';
import Details from '../components/details';
import MainFrame from '../components/mainFrame';
import Header from '../components/mainFrame/mainFrameViewHeader';
import Meta from '../components/meta';
import { StateDetailsOpened } from '../controllers/data/states';

const Page = () => {
  const publicUrl = process.env.NEXT_PUBLIC_URL ?? 'localhost:3000';
  const detailsOpened = useRecoilValue(StateDetailsOpened);

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <Meta
        title="US Stockinfo | junekimdev"
        desc="US Stockinfo created by junekimdev"
        url={publicUrl}
      ></Meta>
      <MainFrame>
        <Header />
        <Chart />
        {detailsOpened && <Details />}
      </MainFrame>
    </>
  );
};

export default Page;
