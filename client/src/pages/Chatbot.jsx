import React, { useState } from 'react';
import axios from 'axios';

export default function Chatbot() {
  const [messages, setMessages] = useState([
    { from: 'bot', text: 'Hi! How can I help you today?' }
  ]);
  const [input, setInput] = useState('');

  const handleSend = async (e) => {
    e.preventDefault();
    if (!input.trim()) return;

    const newMessages = [...messages, { from: 'user', text: input }];
    setMessages(newMessages);
    setInput('');

    try {
      const res = await axios.post('http://localhost:5000/api/ai/chat', { message: input });
      const botReply = { from: 'bot', text: res.data.reply };
      const productList = res.data.products || [];
      setMessages(prev => [...prev, botReply, ...productList.map(p => ({ from: 'product', product: p }))]);
    } catch (err) {
      setMessages(prev => [...prev, { from: 'bot', text: 'Error contacting AI server.' }]);
    }
  };

  return (
    <div style={{ padding: '1rem', maxWidth: '600px', margin: 'auto' }}>
      <div style={{ height: '300px', overflowY: 'auto', border: '1px solid #ccc', padding: '1rem' }}>
        {messages.map((msg, idx) => {
          if (msg.from === 'product') {
            const p = msg.product;
            return (
              <div key={idx} style={{ border: '1px solid #ddd', margin: '0.5rem 0', padding: '0.5rem' }}>
                <img src={p.image} alt={p.name} width="100" />
                <p><strong>{p.name}</strong></p>
                <p>{p.description}</p>
                <p><em>${p.price}</em></p>
              </div>
            );
          }
          return (
            <div key={idx} style={{ textAlign: msg.from === 'user' ? 'right' : 'left' }}>
              <p><strong>{msg.from}:</strong> {msg.text}</p>
            </div>
          );
        })}
      </div>
      <form onSubmit={handleSend} style={{ marginTop: '1rem' }}>
        <input
          type="text"
          value={input}
          onChange={e => setInput(e.target.value)}
          placeholder="Ask something..."
          style={{ width: '80%', padding: '0.5rem' }}
        />
        <button type="submit" style={{ padding: '0.5rem' }}>Send</button>
      </form>
    </div>
  );
}