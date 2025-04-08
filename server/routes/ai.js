const express = require('express');
const router = express.Router();
const Product = require('../models/Product');

router.post('/chat', async (req, res) => {
  const { message } = req.body;
  if (!message) return res.status(400).json({ error: 'Message is required' });

  const keywords = ['laptop', 'phone', 'shoe', 'shirt', 'product', 'item', 'buy'];
  const foundKeyword = keywords.find(kw => message.toLowerCase().includes(kw));

  if (foundKeyword) {
    const products = await Product.find({
      category: { $regex: foundKeyword, $options: 'i' }
    });

    if (products.length === 0) {
      return res.json({ reply: `Sorry, no ${foundKeyword}s found.` });
    }

    return res.json({
      reply: `Here are some ${foundKeyword}s:`,
      products: products.map(p => ({
        name: p.name,
        price: p.price,
        image: p.image,
        description: p.description
      }))
    });
  }

  res.json({ reply: `You said: "${message}"` });
});

module.exports = router;