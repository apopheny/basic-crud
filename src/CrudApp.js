import React, { useState, useEffect } from 'react';

const CrudApp = () => {
  const [items, setItems] = useState([]);
  const [currentItem, setCurrentItem] = useState({ id: null, name: '' });
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    const response = await fetch('http://localhost:5000/items');
    const data = await response.json();
    setItems(data);
  };

  const addItem = async (item) => {
    const response = await fetch('http://localhost:5000/items', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(item),
    });
    const newItem = await response.json();
    setItems([...items, newItem]);
  };

  const updateItem = async (id, updatedItem) => {
    const response = await fetch(`http://localhost:5000/items/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(updatedItem),
    });
    const newItem = await response.json();
    setItems(items.map((item) => (item.id === id ? newItem : item)));
  };

  const deleteItem = async (id) => {
    await fetch(`http://localhost:5000/items/${id}`, {
      method: 'DELETE',
    });
    setItems(items.filter((item) => item.id !== id));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setCurrentItem({ ...currentItem, [name]: value });
  };

  const handleFormSubmit = (e) => {
    e.preventDefault();
    if (editing) {
      updateItem(currentItem.id, currentItem);
    } else {
      addItem(currentItem);
    }
    setCurrentItem({ id: null, name: '' });
    setEditing(false);
  };

  const handleEditClick = (item) => {
    setEditing(true);
    setCurrentItem(item);
  };

  return (
    <div>
      <h2>{editing ? 'Edit Item' : 'Add Item'}</h2>
      <form onSubmit={handleFormSubmit}>
        <input
          type='text'
          name='name'
          value={currentItem.name}
          onChange={handleInputChange}
          required
        />
        <button type='submit'>{editing ? 'Update' : 'Add'}</button>
      </form>

      <h2>Items List</h2>
      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.name}
            <button onClick={() => handleEditClick(item)}>Edit</button>
            <button onClick={() => deleteItem(item.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default CrudApp;
