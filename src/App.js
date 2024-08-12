import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import ForgotPasswordPage from './pages/ForgotPasswordPage';
import UserList from './components/UserList';
import UserDetails from './components/UserDetails';

function App() {
  const [userList, setUserList] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(true); // Example state for authentication

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_users');
      const data = await response.json();
      setUserList(data.users);
    } catch (err) {
      console.error('Failed to fetch users.');
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('userToken'); // Clear user token or session
    setIsAuthenticated(false); // Update authentication state
  };

  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/home" element={
          isAuthenticated ? (
            <div className="App">
              <button className="logout-button" onClick={handleLogout}>
                Logout
              </button>
              <div className="user-list-container">
                <UserList userList={userList} />
                <UserDetails fetchUsers={fetchUsers} />
              </div>
            </div>
          ) : (
            <Navigate to="/login" />
          )
        } />
        <Route path="/" element={<Navigate to="/login" />} />
      </Routes>
    </Router>
  );
}

export default App;
