import { PropsWithChildren } from 'react';
import Navbar from './components/nav-bar';

const Layout = ({ children }: PropsWithChildren) => {
  return (
    <>
      <Navbar />
      <div className="flex-1 m-5">{children}</div>
    </>
  );
};

export default Layout;
