import React, { useState, useEffect } from 'react';

function UserList({ userList }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [sortedList, setSortedList] = useState([]);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(5); // Number of users per page

  useEffect(() => {
    // Initialize sorted list and pagination
    setSortedList(userList);
    setCurrentPage(1); // Reset to the first page when user list changes
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

  // Pagination functionality
  const indexOfLastUser = currentPage * usersPerPage;
  const indexOfFirstUser = indexOfLastUser - usersPerPage;
  const currentUsers = sortedList.slice(indexOfFirstUser, indexOfLastUser);

  const totalPages = Math.ceil(sortedList.length / usersPerPage);

  const handlePageChange = (direction) => {
    if (direction === 'next' && currentPage < totalPages) {
      setCurrentPage(prevPage => prevPage + 1);
    } else if (direction === 'prev' && currentPage > 1) {
      setCurrentPage(prevPage => prevPage - 1);
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
        {currentUsers.map((user, index) => (
          <li key={index}>{user.firstName} {user.lastName}</li>
        ))}
      </ol>
      <div className="pagination">
        <button onClick={() => handlePageChange('prev')}>&lt;</button>
        <span>{currentPage}</span>
        <button onClick={() => handlePageChange('next')}>&gt;</button>
      </div>
    </div>
  );
}

export default UserList;
