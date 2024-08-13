import React, { useState, useEffect } from 'react';

function UserList({ userList }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedList, setSortedList] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    // Initialize sorted list
    setSortedList(userList);
  }, [userList]);

  // Search functionality
  const handleSearch = (event) => {
    const query = event.target.value;
    setSearchQuery(query);

    if (query === '') {
      setSortedList(userList);
      setError('');
    } else {
      const filteredUsers = userList.filter(user =>
        `${user.firstName} ${user.lastName}`.toLowerCase().includes(query.toLowerCase())
      );

      if (filteredUsers.length > 0) {
        setSortedList(filteredUsers);
        setError('');
      } else {
        setSortedList([]);
        setError('Not found');
      }
    }
  };

  // Sorting functionality
  const handleSort = (event) => {
    const sortBy = event.target.value;

    if (sortBy === 'ascending') {
      setSortedList(prevList => [...prevList].sort((a, b) => 
        `${a.firstName} ${a.lastName}`.localeCompare(`${b.firstName} ${b.lastName}`)
      ));
    } else if (sortBy === 'descending') {
      setSortedList(prevList => [...prevList].sort((a, b) => 
        `${b.firstName} ${b.lastName}`.localeCompare(`${a.firstName} ${a.lastName}`)
      ));
    }
  };

  return (
    <div className="user-list">
      <h2>User List</h2>
      <input
        type="text"
        value={searchQuery}
        onChange={handleSearch}
        placeholder="Search by name"
      />
      <select onChange={handleSort}>
        <option value="">Sort By</option>
        <option value="ascending">Ascending</option>
        <option value="descending">Descending</option>
      </select>
      {error && <p className="error">{error}</p>}
      <ol>
        {sortedList.map((user, index) => (
          <li key={index}>{user.firstName} {user.lastName}</li>
        ))}
      </ol>
    </div>
  );
}

export default UserList;
