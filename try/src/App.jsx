// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import Projects from './pages/Projects';
import CreateProject from './pages/CreateProject';
import Requests from './pages/Requests';
import Profile from './pages/Profile';
import ProjectDetails from './pages/ProjectDetails';
import Auth from './pages/Auth';
import Auth2 from './pages/Auth2';
import './index.css';
import  User  from './pages/User';
import Notifications from './pages/Notifications';
import Contracts from './pages/Contracts';
import Payment from './pages/Payment';
import Conter from './pages/Conter';
import Contract from './pages/contract'
import LandingPage from './pages/LandingPage';
import LandingHome from './components/LandingHome';
import About from './components/About';
import Features from './components/Features';
import Footer from './components/Footer';

function App() {
  return (
    <Routes>
      <Route path="/" element={<LandingPage/>} >
        <Route index element={<LandingHome />} />
        <Route path="features" element={<Features />} />
        <Route path="about" element={<About />} />
        <Route path="contact" element={<Footer />} />
      </Route>
      <Route path="/auth" element={<Auth />} />
      <Route path="/auth2/:token" element={<Auth2 />} />

      <Route
        path="/dashboard"
        element={
          <Layout>
            <Dashboard />
          </Layout>
        }
      />
      <Route
        path="/projects"
        element={
          <Layout>
            <Projects />
          </Layout>
        }
      />
      <Route
        path="/AllProjects"
        element={
            <Projects />
        }
      />
      <Route
        path="/create-project"
        element={
          <Layout>
            <CreateProject />
          </Layout>
        }
      />
      <Route
        path="/requests"
        element={
          <Layout>
            <Requests />
          </Layout>
        }
      />
      <Route
        path="/profile"
        element={
          <Layout>
            <Profile />
          </Layout>
        }
      />
      <Route
        path="/user/:id"
        element={
          <Layout>
            <User />
          </Layout>
        }
      />
      <Route
        path="/projects/:id"
        element={
          <Layout>
            <ProjectDetails />
          </Layout>
        }
      />
       <Route
        path="/AllProjects/:id"
        element={
            <ProjectDetails />
        }
      />

      <Route
        path="/notification"
        element={
          <Layout>
            <Notifications />
          </Layout>
        }
      />
      <Route
        path="/contracts"
        element={
          <Layout>
            <Contracts />
          </Layout>
        }/>
      <Route
        path="/payment"
        element={
        <Layout>
        <Payment/>
        </Layout>
      }
     />
     <Route
        path="/conter/:id"
        element={
        <Layout>
        <Conter/>
        </Layout>
      }
     />
     <Route
        path="/contract/:id"
        element={
        <Layout>
        <Contract/>
        </Layout>
      }
     />
    </Routes>
  );
}

export default App;
