import React, { useState, useEffect } from 'react';
import { getUsers, createUser, updateUser, deleteUser } from '../api';

const UserList = () => {
  const [users, setUsers] = useState([]);
  const [name, setName] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const users = await getUsers();
      console.log('Fetched users:', users); // Add logging
      setUsers(users);
    } catch (err) {
      console.error('Error fetching users:', err);
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingUser) {
        const updatedUser = await updateUser(editingUser._id, name);
        console.log('Updated user:', updatedUser); // Add logging
        setUsers(
          users.map((user) =>
            user._id === updatedUser._id ? updatedUser : user
          )
        );
        setEditingUser(null);
      } else {
        const newUser = await createUser(name);
        console.log('Created new user:', newUser); // Add logging
        setUsers([...users, newUser]);
      }
      setName('');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message);
    }
  };

  const handleEdit = (user) => {
    console.log('Editing user:', user); // Add logging
    setEditingUser(user);
    setName(user.name);
  };

  const handleDelete = async (id) => {
    try {
      await deleteUser(id);
      console.log('Deleted user with ID:', id); // Add logging
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      console.error('Error deleting user:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Users</h1>
      {error && <p>{error}</p>}
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            {user.name}
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter user name'
        />
        <button type='submit'>
          {editingUser ? 'Update User' : 'Add User'}
        </button>
      </form>
    </div>
  );
};

export default UserList;
