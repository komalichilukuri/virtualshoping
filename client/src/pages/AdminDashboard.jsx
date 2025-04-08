import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [products, setProducts] = useState([]);
  const [form, setForm] = useState({ name: '', description: '', price: '', image: '', category: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    const res = await axios.get('http://localhost:5000/api/products');
    setProducts(res.data);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (editingId) {
      await axios.put(`http://localhost:5000/api/products/${editingId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/products', form);
    }
    setForm({ name: '', description: '', price: '', image: '', category: '' });
    setEditingId(null);
    fetchProducts();
  };

  const handleEdit = (product) => {
    setForm(product);
    setEditingId(product._id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/products/${id}`);
    fetchProducts();
  };

  return (
    <div style={{ padding: '2rem' }}>
      <h2>Admin Dashboard - Manage Products</h2>

      <form onSubmit={handleSubmit} style={{ marginBottom: '2rem' }}>
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="description" placeholder="Description" value={form.description} onChange={handleChange} />
        <input name="price" placeholder="Price" type="number" value={form.price} onChange={handleChange} />
        <input name="image" placeholder="Image URL" value={form.image} onChange={handleChange} />
        <input name="category" placeholder="Category" value={form.category} onChange={handleChange} />
        <button type="submit">{editingId ? 'Update' : 'Add'} Product</button>
      </form>

      <table border="1" cellPadding="10">
        <thead>
          <tr>
            <th>Name</th><th>Description</th><th>Price</th><th>Category</th><th>Image</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map(p => (
            <tr key={p._id}>
              <td>{p.name}</td>
              <td>{p.description}</td>
              <td>${p.price}</td>
              <td>{p.category}</td>
              <td><img src={p.image} alt="" width="50" /></td>
              <td>
                <button onClick={() => handleEdit(p)}>Edit</button>
                <button onClick={() => handleDelete(p._id)}>Delete</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}