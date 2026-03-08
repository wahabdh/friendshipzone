const express = require('express');
const cors = require('cors');
const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Sample menu items in memory
let menuItems = [
  {
    id: 1,
    name: 'Zinger Burger',
    quantity: '1',
    price: 450,
    image: 'https://via.placeholder.com/300x200?text=Zinger+Burger'
  },
  {
    id: 2,
    name: 'Chicken Biryani',
    quantity: 'Full Plate',
    price: 350,
    image: 'https://via.placeholder.com/300x200?text=Chicken+Biryani'
  },
  {
    id: 3,
    name: 'Pizza Slice',
    quantity: '1 Slice',
    price: 300,
    image: 'https://via.placeholder.com/300x200?text=Pizza+Slice'
  },
  {
    id: 4,
    name: 'Fries',
    quantity: 'Regular',
    price: 200,
    image: 'https://via.placeholder.com/300x200?text=Fries'
  },
  {
    id: 5,
    name: 'Cold Drink',
    quantity: '500ml',
    price: 120,
    image: 'https://via.placeholder.com/300x200?text=Cold+Drink'
  }
];

let nextId = 6;

// Routes

// GET all menu items
app.get('/api/menu', (req, res) => {
  res.json(menuItems);
});

// POST new menu item
app.post('/api/menu', (req, res) => {
  const { name, quantity, price, image } = req.body;

  if (!name || !quantity || !price || !image) {
    return res.status(400).json({ error: 'All fields are required' });
  }

  const newItem = {
    id: nextId++,
    name,
    quantity,
    price: Number(price),
    image
  };

  menuItems.push(newItem);
  res.status(201).json(newItem);
});

// PUT update menu item
app.put('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const { name, quantity, price, image } = req.body;

  const item = menuItems.find(item => item.id === Number(id));
  if (!item) {
    return res.status(404).json({ error: 'Item not found' });
  }

  if (name) item.name = name;
  if (quantity) item.quantity = quantity;
  if (price) item.price = Number(price);
  if (image) item.image = image;

  res.json(item);
});

// DELETE menu item
app.delete('/api/menu/:id', (req, res) => {
  const { id } = req.params;
  const index = menuItems.findIndex(item => item.id === Number(id));

  if (index === -1) {
    return res.status(404).json({ error: 'Item not found' });
  }

  const deletedItem = menuItems.splice(index, 1);
  res.json(deletedItem[0]);
});

app.listen(PORT, () => {
  console.log(`FriendshipZone Backend running on http://localhost:${PORT}`);
});
