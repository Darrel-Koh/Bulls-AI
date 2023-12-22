import { Router } from 'express';
const router = Router();
import Stock, { find } from '../models/Stock';

// Get all stocks
router.get('/', async (req, res) => {
  try {
    const stocks = await find();
    res.json(stocks);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Add a new stock
router.post('/', async (req, res) => {
  const stock = new Stock({
    symbol: req.body.symbol,
    companyName: req.body.companyName,
    // Add more fields as needed
  });

  try {
    const newStock = await stock.save();
    res.status(201).json(newStock);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

export default router;
