import React, { useState, useEffect } from "react";
import "./dashboard.css";

const API_URL = "http://localhost:5000/api/sales";

function Dashboard() {
  const [form, setForm] = useState({
    customer: "",
    product: "",
    qty: "",
    date: "",
    amount: "",
  });

  const [sales, setSales] = useState([]);
  const [search, setSearch] = useState("");
  const [showTable, setShowTable] = useState(true);

  // Handle input change
  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  // Fetch all sales from backend
  const fetchSales = async () => {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      setSales(data);
    } catch (error) {
      console.error("Error fetching sales:", error);
    }
  };

  // Add new sale to backend
  const handleAdd = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!form.customer || !form.product || !form.qty || !form.date || !form.amount) {
      alert("Please fill all fields!");
      return;
    }

    const newSale = {
      customer: form.customer.trim(),
      product: form.product.trim(),
      qty: Number(form.qty),
      date: form.date,
      amount: Number(form.amount),
    };

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newSale),
      });

      const data = await res.json();

      // Update UI instantly
      setSales([data, ...sales]);
      setForm({ customer: "", product: "", qty: "", date: "", amount: "" });
    } catch (error) {
      console.error("Error adding sale:", error);
      alert("Failed to add sale. Please check your backend connection.");
    }
  };

  // Handle search input
  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  // ✅ Fixed: safely filter even if some fields are undefined
  const filteredSales = sales.filter((sale) => {
    const customer = sale.customer ? sale.customer.toLowerCase() : "";
    const product = sale.product ? sale.product.toLowerCase() : "";
    const query = search.toLowerCase();

    return customer.includes(query) || product.includes(query);
  });

  // Fetch data when page loads
  useEffect(() => {
    fetchSales();
  }, []);

  return (
    <div className="dashboard-wrapper">
      <h1>📊 Sales Dashboard</h1>

      <form className="form" onSubmit={handleAdd}>
        <input
          type="text"
          name="customer"
          placeholder="Customer Name"
          value={form.customer}
          onChange={handleChange}
        />
        <input
          type="text"
          name="product"
          placeholder="Product"
          value={form.product}
          onChange={handleChange}
        />
        <input
          type="number"
          name="qty"
          placeholder="Quantity"
          value={form.qty}
          onChange={handleChange}
        />
        <input
          type="date"
          name="date"
          value={form.date}
          onChange={handleChange}
        />
        <input
          type="number"
          name="amount"
          placeholder="Amount"
          value={form.amount}
          onChange={handleChange}
        />
        <button type="submit" className="add-btn">
          ➕ Add Sale
        </button>
      </form>

      <div className="action-bar">
        <input
          type="text"
          className="search-bar"
          placeholder="🔍 Search by name or product"
          value={search}
          onChange={handleSearch}
        />
        <button className="toggle-btn" onClick={() => setShowTable(!showTable)}>
          {showTable ? "🙈 Hide Sales Table" : "👀 Show Sales Table"}
        </button>
      </div>

      {showTable && (
        <div className="table-container">
          {filteredSales.length === 0 ? (
            <p className="no-data">No sales record found.</p>
          ) : (
            <table className="sales-table">
              <thead>
                <tr>
                  <th>Customer</th>
                  <th>Product</th>
                  <th>Quantity</th>
                  <th>Date</th>
                  <th>Amount</th>
                </tr>
              </thead>
              <tbody>
                {filteredSales.map((sales) => (
                  // 👇 Use `_id` from MongoDB instead of local `id`
                  <tr key={sales._id}>
                    <td>{sales.customer}</td>
                    <td>{sales.product}</td>
                    <td>{sales.qty}</td>
                    <td>{sales.date}</td>
                    <td>₹{sales.amount}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default Dashboard;
