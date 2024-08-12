import React from 'react';

function UserList({ userList }) {
  return (
    <div className="user-list">
      <h2>User List</h2>
      <ol>
        {userList.map((user, index) => (
          <li key={index}>{user.firstName} {user.lastName}</li>
        ))}
      </ol>
    </div>
  );
}

export default UserList;
