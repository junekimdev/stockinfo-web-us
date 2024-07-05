import { useRouter } from 'next/router';
import { useEffect } from 'react';
import MainFrame from '../components/mainFrame';
import Meta from '../components/meta';
import Search from '../components/search';

const Page = () => {
  const publicUrl = process.env.NEXT_PUBLIC_URL ?? 'localhost:3000';
  const router = useRouter();

  useEffect(() => {
    window.scrollTo(0, 0);
    router.prefetch('/chart');
  }, [router]);

  return (
    <>
      <Meta
        title="JK Stock US | junekimdev"
        desc="JK Stock US created by junekimdev"
        url={publicUrl}
      ></Meta>
      <MainFrame>
        <Search />
      </MainFrame>
    </>
  );
};

export default Page;
