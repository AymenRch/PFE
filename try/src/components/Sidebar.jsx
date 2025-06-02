import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  FolderKanban,
  FilePlus,
  MessageSquareMore,
  Moon,
  Sun,
  LogOut,
  FileUser,
  CreditCard
} from 'lucide-react';
import { useTheme } from '../context/ThemeContext';
import './Sidebar.css';

const Sidebar = () => {
  const { isDarkMode, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const username = localStorage.getItem('username') || '';
  const pp = localStorage.getItem('pp');
  const profilePicUrl = pp ? `http://localhost:9000/${pp}` : '/default-avatar.png';

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('username');
    localStorage.removeItem('pp');
    navigate('/auth');
  };

  return (
    <div className="sidebar">
     <div className="footer-logo footer-logo3">Grow<span style={{color:'#00915C'}}>Vest</span></div>


      <nav className="nav-menu">
        <NavLink to="/dashboard" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <LayoutDashboard size={20} />
          <span>Dashboard</span>
        </NavLink>

        <NavLink to="/projects" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FolderKanban size={20} />
          <span>Browse Projects</span>
        </NavLink>

        <NavLink to="/create-project" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FilePlus size={20} />
          <span>Create Project</span>
        </NavLink>

        <NavLink to="/requests" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <MessageSquareMore size={20} />
          <span>Requests</span>
        </NavLink>

        <NavLink to="/contracts" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <FileUser size={20} />
        <span>Contracts</span>
        </NavLink>
        <NavLink to="/payment" className={({ isActive }) => isActive ? 'nav-item active' : 'nav-item'}>
          <CreditCard size={20} />
        <span>Payment</span>
        </NavLink>
      </nav>

      <div className="sidebar-bottom">
        <div className="dark-mode-toggle">
          {isDarkMode ? <Moon size={20} /> : <Sun size={20} />}
          <span>Dark Mode</span>
          <label className="switch">
            <input 
              type="checkbox" 
              checked={isDarkMode}
              onChange={toggleTheme}
            />
            <span className="slider round"></span>
          </label>
        </div>

        <button className="logout-btn" onClick={handleLogout}>
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;