import React from 'react';
import { useLocation } from 'react-router-dom';
import DashBoard from '../pages/DashBoard/DashBoard';

const Layout = ({ children }) => {
  const location = useLocation();
  const hiddenRoutes = ['/Login', '/FirstLogin', '/ForgetPassword'];
  const hideNavbar = hiddenRoutes.includes(location.pathname);

  return (
    <>
      {!hideNavbar && <DashBoard />}
      <div>{children}</div>
    </>
  );
};

export default Layout;
