import React, { useState, useEffect } from 'react';
import { getItems, createItem, updateItem, deleteItem } from '../api';

const ItemList = () => {
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [editingItem, setEditingItem] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchItems();
  }, []);

  const fetchItems = async () => {
    try {
      const items = await getItems();
      console.log('Fetched items:', items); // Add logging
      setItems(items);
    } catch (err) {
      console.error('Error fetching items:', err);
      setError(err.message);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        const updatedItem = await updateItem(editingItem._id, name);
        console.log('Updated item:', updatedItem); // Add logging
        setItems(
          items.map((item) =>
            item._id === updatedItem._id ? updatedItem : item
          )
        );
        setEditingItem(null);
      } else {
        const newItem = await createItem(name);
        console.log('Created new item:', newItem); // Add logging
        setItems([...items, newItem]);
      }
      setName('');
    } catch (err) {
      console.error('Error submitting form:', err);
      setError(err.message);
    }
  };

  const handleEdit = (item) => {
    console.log('Editing item:', item); // Add logging
    setEditingItem(item);
    setName(item.name);
  };

  const handleDelete = async (id) => {
    try {
      await deleteItem(id);
      console.log('Deleted item with ID:', id); // Add logging
      setItems(items.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Error deleting item:', err);
      setError(err.message);
    }
  };

  return (
    <div>
      <h1>Items</h1>
      {error && <p>{error}</p>}
      <ul>
        {items.map((item) => (
          <li key={item._id}>
            {item.name}
            <button onClick={() => handleEdit(item)}>Edit</button>
            <button onClick={() => handleDelete(item._id)}>Delete</button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          type='text'
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder='Enter item name'
        />
        <button type='submit'>
          {editingItem ? 'Update Item' : 'Add Item'}
        </button>
      </form>
    </div>
  );
};

export default ItemList;
