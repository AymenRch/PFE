// components/Layout.js
import React from 'react';
import Sidebar from './Sidebar';
import Topbar from './Topbar';

const Layout = ({ children }) => {
  return (
    <div className="app-container">
      <Sidebar />
      <div className="content-container">
        <Topbar />
        {children}
      </div>
    </div>
  );
};

export default Layout;
