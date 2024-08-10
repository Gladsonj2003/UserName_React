import React, { useState, useEffect } from 'react';
import './App.css';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');
  const [userList, setUserList] = useState([]);

  useEffect(() => {
    // Fetch the user list on component mount
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:5000/get_users');
      const data = await response.json();
      setUserList(data.users);
    } catch (err) {
      setError('Failed to fetch users.');
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError('');
    setMessage('');

    if (firstName.trim() === '' || lastName.trim() === '') {
      setError('Please enter both first name and last name.');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/add_users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ firstName, lastName }),
      });

      const data = await response.json();

      if (response.ok) {
        setMessage('User added successfully!');
        setFirstName('');
        setLastName('');
        fetchUsers(); // Refresh user list
      } else {
        setError(data.error || 'Something went wrong!');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="App">
      <div className="user-list-container">
        <div className="user-list">
          <h2>User List</h2>
          <ol>
            {userList.map((user, index) => (
              <li key={index}>{user.firstName} {user.lastName}</li>
            ))}
          </ol>
        </div>
        <div className="user-details">
          <h1>Enter Your Name</h1>
          <form onSubmit={handleSubmit}>
            <label>
              First Name
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                placeholder="Enter your first name"
              />
            </label>
            <label>
              Last Name
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                placeholder="Enter your last name"
              />
            </label>
            {error && <p className="error">{error}</p>}
            {message && <p className="success">{message}</p>}
            <button type="submit">Submit</button>
          </form>
        </div>
      </div>
    </div>
  );
}

export default App;
