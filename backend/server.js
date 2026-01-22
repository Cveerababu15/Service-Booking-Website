const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const authRoutes = require("./routes/authRoutes.js");
const bookingRoutes=require("./routes/bookingRoutes.js")
const serviceRoutes=require("./routes/serviceRoutes.js")
const app = express();

app.use(cors());
app.use(express.json());

app.get("/", (rq, res) => {
  res.send("Service Booking Backend is running");
});

// Importing Routes
app.use("/api/auth", authRoutes);

app.use("/api/bookings",bookingRoutes);
app.use("/api/services",serviceRoutes);
mongoose
  .connect(process.env.MONGO_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.log("Failed to connect to MongoDB", err));

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
