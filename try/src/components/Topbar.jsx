import React from 'react';
import { Bell } from 'lucide-react';
import './Topbar.css';
import { Link, useNavigate } from 'react-router-dom';

const Topbar = () => {
  const username = localStorage.getItem('username') || '';
  const pp = localStorage.getItem('pp');
  const profilePicUrl = pp ? `http://localhost:9000/${pp}` : '/default-avatar.png';
  const navigate = useNavigate()


  return (
    <div className="topbar">
      <h1 className="page-title">Dashboard</h1>

      <div className="topbar-right">
       <div className="notification-btn">
       <Link to="/notification">
          <Bell size={20} />
        </Link>
       </div>

        <div className="user-profile">
          <Link to="/profile" className="user-profile profile-link">
            <img
              src={profilePicUrl}
              alt="User"
              className="user-avatar"
              onError={(e) => {
                e.target.onerror = null;
                e.target.src = '/default-avatar.png';
              }}
            />
            <div className="profile-link-info">
              <span className="profile-link-name">{username}</span>
              <span className="profile-link-welcome">View Profile</span>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Topbar;
