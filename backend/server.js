require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: "https://blog-post-green-rho.vercel.app", 
    methods: ["GET", "POST", "PUT", "DELETE"],
    allowedHeaders: ["Content-Type"]
}));

// MongoDB connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
    .then(() => console.log("MongoDB Connected"))
    .catch(err => {
        console.error("MongoDB connection error:", err);
        process.exit(1);  // Exiting the process if MongoDB connection fails
    });

// Import routes
const blogRoutes = require("./routes/blogRoutes");

// API route handler
app.use("/api", blogRoutes);

// Default route for non-existing endpoints
app.get('*', (req, res) => {
    res.status(404).json({ message: 'API endpoint not found!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

module.exports = app;
