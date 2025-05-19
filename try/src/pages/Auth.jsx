import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./auth.css";

const Auth = () => {
  const [isRightPanelActive, setRightPanelActive] = useState(false);
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [cred, setCred] = useState({
    name: "",
    email: "",
    password: "",
    password2: ""
  });

  const handleChange = (e) => {
    setCred({ ...cred, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(cred.password !== cred.password2) {
      setMessage("Passwords don't match");
      return;
    }
      try {
        const res = await axios.post("http://localhost:9000/auth/check", {
          name: cred.name,
          email: cred.email,
          password: cred.password,
        });
        setMessage(res.data.message);
      } catch (error) {
        setMessage(error.response?.data?.message || "Something went wrong");
      }
    
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("http://localhost:9000/auth/login", {
        email: cred.email,
        password: cred.password,
      });
      
      if (res.status === 200) {
        // Store token
        localStorage.setItem('token', res.data.token);
        
        // Fetch user data
        const userRes = await axios.get(`http://localhost:9000/auth/get/${res.data.token}`);
        const userData = userRes.data.user;
        
        // Store user data
        localStorage.setItem('username', userData.name);
        localStorage.setItem('pp', userData.ProfilePicture);
        
        setMessage('Login successful!');
        navigate("/dashboard");
      }
    } catch (error) {
      console.error('Login error:', error);
      setMessage(error.response?.data?.error || 'Login failed. Please try again.');
    }
  };

  return (
    <div className="auth">
      <div className={`container ${isRightPanelActive ? "right-panel-active" : ""}`} id="container">
        {/* Sign Up Form */}
        <div className="form-container sign-up-container">
          <form onSubmit={handleSubmit}>
            <h1>Create Account</h1>
            <input type="text" name="name" onChange={handleChange} placeholder="Name" required />
            <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
            <input type="password" name="password2" onChange={handleChange} placeholder="Confirm Password" required />
            <button type="submit">Sign Up</button>
          </form>
        </div>

        {/* Sign In Form */}
        <div className="form-container sign-in-container">
          <form onSubmit={handleLogin}>
            <h1>Sign in</h1>
            <span>or use your account</span>
            <input type="email" name="email" onChange={handleChange} placeholder="Email" required />
            <input type="password" name="password" onChange={handleChange} placeholder="Password" required />
            <a href="#">Forgot your password?</a>
            <button type="submit">Sign In</button>
          </form>
        </div>

        {/* Overlay */}
        <div className="overlay-container">
          <div className="overlay">
            <div className="overlay-panel overlay-left">
              <h1>Welcome Back!</h1>
              <p>To keep connected with us please login with your personal info</p>
              <button className="ghost" onClick={() => setRightPanelActive(false)}>Sign In</button>
            </div>
            <div className="overlay-panel overlay-right">
              <h1>Hello, Friend!</h1>
              <p>Enter your personal details and start your journey with us</p>
              <button className="ghost" onClick={() => setRightPanelActive(true)}>Sign Up</button>
            </div>
          </div>
        </div>
      </div>

      {/* Message Display */}
      {message && (
        <p
          style={{
            marginTop: "10px",
            padding: "10px",
            borderRadius: "5px",
            fontSize: "14px",
            fontWeight: "bold",
            textAlign: "center",
            color: "white",
            backgroundColor: message.includes("wrong") || message.includes("exists") ? "#f44336" : "#4caf50",
          }}
        >
          {message}
        </p>
      )}
    </div>
  );
};

export default Auth;
