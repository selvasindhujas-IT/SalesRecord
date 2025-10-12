const express = require("express");
const router = express.Router();
const Sale = require("../models/Sale");

router.post("/", async (req, res) => {
  try {
    const { customer, product, qty, date, amount } = req.body;

    if (!customer || !product || !qty || !date || !amount) {
      return res.status(400).json({ error: "All fields are required" });
    }

    const newSale = new Sale({ customer, product, qty, date, amount });
    const savedSale = await newSale.save();

    res.status(201).json(savedSale);
  } catch (error) {
    console.error("Error adding sale:", error);
    res.status(500).json({ error: "Failed to add sale" });
  }
});


router.get("/", async (req, res) => {
  try {
    const sales = await Sale.find().sort({ date: -1 });
    res.json(sales);
  } catch (error) {
    console.error("Error fetching sales:", error);
    res.status(500).json({ error: "Failed to fetch sales" });
  }
});

module.exports = router;
