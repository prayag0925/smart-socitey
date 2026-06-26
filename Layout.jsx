import React, { useEffect } from 'react';
import AppNavbar from './Navbar';
import Sidebar from './Sidebar';
import { useDispatch } from 'react-redux';
import { fetchNotifications } from '../../redux/slices/notificationSlice';

const Layout = ({ children }) => {
  const dispatch = useDispatch();
  useEffect(() => { dispatch(fetchNotifications()); }, [dispatch]);

  return (
    <div className="d-flex flex-column" style={{ minHeight: '100vh' }}>
      <AppNavbar />
      <div className="d-flex flex-grow-1">
        <Sidebar />
        <div className="flex-grow-1 p-4 bg-light">{children}</div>
      </div>
    </div>
  );
};

export default Layout;
