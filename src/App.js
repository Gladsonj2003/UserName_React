import React, { useState } from 'react';
import './App.css';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

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
      } else {
        setError(data.error || 'Something went wrong!');
      }
    } catch (err) {
      setError('Failed to connect to the server.');
    }
  };

  return (
    <div className="App">
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
  );
}

export default App;
