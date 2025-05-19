import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Notifications.css';
import { useNavigate } from 'react-router-dom';

const Notifications = () => {
  const [notifications, setNot] = useState([]);
  const navigate = useNavigate();

  const handleClick = async (id) => {
    const clickedNoti = notifications.find(n => n.id === id);
    if (!clickedNoti) return;

    // Optimistically update UI
    setNot(prev =>
      prev.map(n =>
        n.id === id ? { ...n, state: 'read' } : n
      )
    );

    try {
      const res = await axios.put(`http://localhost:9000/auth/notifications/${id}`);
      if (res.status === 200) {
        if (clickedNoti.userType === 'entreproneur') {
          navigate('/requests');
        } else {
          navigate('/contracts');
        }
      } else {
        console.error('Error updating notification state');
      }
    } catch (error) {
      console.error('Error updating notification:', error);
    }
  };

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const token = localStorage.getItem('token');
        const res = await axios.get(`http://localhost:9000/auth/notifications/${token}`);
        setNot(res.data);
      } catch (error) {
        console.error('Error fetching notifications:', error);
      }
    };

    fetchNotifications();
  }, []);
    const joinDate = notifications.timeStamp ? new Date(notifications.timeStamp).toLocaleDateString() : '';


  return (
    <div className='Notifications-container'>
      {notifications.slice().reverse().map(notification => (
        <div
          onClick={() => handleClick(notification.id)}
          key={notification.id}
          style={{ cursor: 'pointer' }}
          className={`notification ${notification.state === 'unread' ? 'unread' : ''}`}
        >
          <h4>{notification.title}</h4>
          <p>{notification.message}</p>
          <p style={{ marginLeft: '430px' }}>{notification.timeStamp ? new Date(notification.timeStamp).toLocaleString() : ''}</p>
        </div>
      ))}
    </div>
  );
};

export default Notifications;
