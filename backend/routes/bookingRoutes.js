const express = require("express");
const router = express.Router();

const authMiddleware = require("../middleware/authMiddleware.js");
const { isAdmin } = require("../middleware/roleMiddleware.js");

const {
  createbooking,
  getAllBookings,
  getAllBookingsAdmin,
  updateBookingStatus,
} = require("../controllers/bookingController.js");

// USER ROUTES
router.post("/", authMiddleware, createbooking);
router.get("/mybookings", authMiddleware, getAllBookings);

// ADMIN ROUTES
router.get("/allbookings", authMiddleware, isAdmin, getAllBookingsAdmin);

router.patch("/:id/status", authMiddleware, isAdmin, updateBookingStatus);
module.exports = router;
