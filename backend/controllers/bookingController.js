const Booking = require("../models/Booking.js");
const Service = require("../models/Service.js");

// USER: Create a new booking
exports.createbooking = async (req, res) => {
    try {
        const { serviceId, bookingDate } = req.body;
        if (!serviceId || !bookingDate) {
            return res.status(400).json({ message: "All fields are required" });
        }
        const service = await Service.findById(serviceId);
        if (!service || !service.isActive) {
            return res.status(404).json({ message: "Service not found or inactive" });
        }
        const bookings = await Booking.create({
            userId: req.userId,
            serviceId,
            bookingDate
        });
        res.status(201).json({ message: "Booking created successfully", bookings });
    } catch (error) {
        console.error("Create booking error:", error);
        res.status(500).json({ message: "Failed to create booking", error: error.message });
    }
};

// Get My Bookings
exports.getAllBookings = async (req, res) => {
    try {
        const bookings = await Booking.find({ userId: req.userId })
            .populate('serviceId', 'name price');
        res.status(200).json({ bookings });

    } catch (error) {
        console.error("Get all bookings error:", error);
        res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
};

// Admin: Get bookings for THEIR services
exports.getAllBookingsAdmin = async (req, res) => {
    try {
        // Find services created by this admin
        const myServices = await Service.find({ adminId: req.userId }).select('_id');
        const serviceIds = myServices.map(s => s._id);

        const bookings = await Booking.find({ serviceId: { $in: serviceIds } })
            .populate('userId', 'name email')
            .populate('serviceId', 'name price');
        res.status(200).json({ bookings });

    } catch (error) {
        console.error("Get all bookings admin error:", error);
        res.status(500).json({ message: "Failed to fetch bookings", error: error.message });
    }
};

// ADMIN BOOKING STATUS UPDATE
exports.updateBookingStatus = async (req, res) => {
    try {
        const { status } = req.body;
        if (!['pending', 'accepted', 'rejected', 'completed'].includes(status)) {
            return res.status(400).json({ message: "Invalid status value" });
        }

        // Check if the booking belongs to a service owned by this admin
        const bookingToUpdate = await Booking.findById(req.params.id).populate('serviceId');
        if (!bookingToUpdate) {
            return res.status(404).json({ message: "Booking not found" });
        }

        if (bookingToUpdate.serviceId.adminId.toString() !== req.userId) {
            return res.status(403).json({ message: "Unauthorized to update this booking" });
        }

        const booking = await Booking.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        return res.status(200).json({ message: "Booking status updated successfully", booking });
    } catch (error) {
        console.error("Update booking status error:", error);
        res.status(500).json({ message: "Failed to update booking status", error: error.message });
    }
};
