import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StatsCard from '../components/StatsCard';
import axios from 'axios';
import { 
  Flame, 
  DollarSign,  
  SmilePlus ,
  ListChecks
} from 'lucide-react';
import { Bar, Doughnut, Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import './Dashboard.css';

ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  ArcElement,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);



const Dashboard = () => {

  const navigate = useNavigate();
  const [username, setUsername] = useState('');
  const [pp, setPP] = useState('');
  const [stats, setStats] = useState({});
  

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/auth");
      return;
    }

    axios.get(`http://localhost:9000/auth/get/${token}`)
      .then(res => {
        const userData = res.data.user;
        // Update state with data from API response
        setUsername(userData.name);
        setPP(userData.ProfilePicture);
        // Store data in localStorage as well (optional)
        localStorage.setItem('username', userData.name);
        localStorage.setItem('pp', userData.ProfilePicture);
        setStats(res.data.stats)
      
      })
      .catch(err => {
        console.error("Error verifying token or fetching data:", err);
        navigate("/auth"); // Redirect if token is invalid/expired
      });
  }, [navigate]);
  
  

  const weeklyCheckIns = {
    labels: ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
    datasets: [{
      data: [150, 230, 280, 320, 180, 250, 290],
      backgroundColor: [
        '#9BB8ED',
        '#6DE7B4',
        '#333333',
        '#7665F1',
        '#9BB8ED',
        '#6DE7B4',
        '#E882D8'
      ],
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  const equipmentUsage = {
    labels: ['IT', 'Restoration', 'Stock Market', 'Real Estate'],
    datasets: [{
      data: [42.1, 22.8, 13.9, 21.2],
      backgroundColor: [
        '#7665F1',
        '#9BB8ED',
        '#6DE7B4',
        '#E0E0E0'
      ],
      borderWidth: 0,
    }]
  };

  const balanceData = {
    labels: ['06:00AM', '07:00AM', '08:00AM', '09:00AM', '10:00AM', '11:00AM', '12:00PM', '01:00PM', '02:00PM', '03:00PM', '04:00PM', '05:00PM', '06:00PM', '07:00PM'],
    datasets: [{
      label: 'Balance',
      data: [20, 25, 18, 30, 15, 35, 25, 35, 20, 25, 30, 25, 30, 35],
      fill: true,
      borderColor: '#7665F1',
      backgroundColor: 'rgba(118, 101, 241, 0.1)',
      tension: 0.4,
      pointRadius: 0,
    }]
  };

  const barOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        enabled: true
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  const doughnutOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: 'right',
        labels: {
          boxWidth: 10,
          padding: 15,
          font: {
            size: 12
          }
        }
      }
    },
    cutout: '70%',
    maintainAspectRatio: false
  };

  const lineOptions = {
    responsive: true,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        grid: {
          color: 'rgba(0, 0, 0, 0.05)',
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      },
      x: {
        grid: {
          display: false,
          drawBorder: false
        },
        ticks: {
          font: {
            size: 12
          }
        }
      }
    },
    maintainAspectRatio: false
  };

  return (
    <div className="dashboard-container">
      <div className="stats-grid">
      <StatsCard title="Active Projects" icon={Flame} iconBg={'rgba(86, 247, 131, 0.1)'} value={stats.activeProjects ?? null} color="#00915C" trend="Most active period" />
       
        <StatsCard title="Completed Projects" icon={ListChecks} iconBg={'rgba(118, 101, 241, 0.1)' } value={stats.completedprojects ?? null} trend="Most active period" />

        
        <StatsCard title="Active Investements" icon={DollarSign} iconBg={'rgba(101, 241, 101, 0.1)' } value={stats.activeInvestments ?? null} color="#6DE7B4" trend="Most active period" />

        <div className="stat-card">
          <div className="stat-icon" style={{ backgroundColor: 'rgba(255, 182, 72, 0.1)' }}>
            <SmilePlus size={20} color="#FFB648" />
          </div>
          <div className="stat-content">
            <h3>Completed Investements</h3>
            <div className="stat-value">{stats.completedInvestements ?? null}/{stats.activeInvestments ?? null}</div>
            <div className="stat-trend positive">86% positive feedback</div>
          </div>
        </div>
      </div>

      <div className="charts-grid">
        <div className="chart-container bar-chart">
          <div className="chart-header">
            <h3>Total Users </h3>
            <select className="time-filter">
              <option>This week</option>
              <option>Last week</option>
              <option>Last month</option>
            </select>
          </div>
          <div className="chart-content">
            <Bar data={weeklyCheckIns} options={barOptions} />
          </div>
        </div>

        <div className="chart-container doughnut-chart">
          <div className="chart-header">
            <h3>Popular Fields</h3>
          </div>
          <div className="chart-content">
            <Doughnut data={equipmentUsage} options={doughnutOptions} />
          </div>
        </div>
      </div>

      <div className="chart-container balance-chart">
        <div className="chart-header">
          <h3>Balance</h3>
          <select className="time-filter">
            <option>Hourly</option>
            <option>Daily</option>
            <option>Weekly</option>
          </select>
        </div>
        <div className="chart-content">
          <Line data={balanceData} options={lineOptions} />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;