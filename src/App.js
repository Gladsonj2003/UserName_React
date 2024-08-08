import React, { useState } from 'react';
import './App.css';

function App() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (event) => {
    event.preventDefault();
    if (firstName.trim() === '' || lastName.trim() === '') {
      setError('Please enter both first name and last name.');
    } else {
      console.log(`First Name: ${firstName}`);
      console.log(`Last Name: ${lastName}`);
      setError('');
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
        {error && <p className="error">{error}</p>} {/* Display validation message */}
        <button type="submit">Submit</button>
      </form>
    </div>
  );
}

export default App;
