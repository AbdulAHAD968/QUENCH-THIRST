const express = require('express');
const router = express.Router();
const EmployeeShipping = require('../models/EmployeeShipping');
const mongoose = require('mongoose');

// ✅ Create shipping record
router.post('/', async (req, res) => {
  try {
    const { orderId, employeeId, deliveryTime } = req.body;

    const shippingRecord = new EmployeeShipping({
      orderId,
      employeeId,
      deliveryTime
    });

    await shippingRecord.save();
    res.status(201).json(shippingRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Update shipping status
router.put('/:orderId', async (req, res) => {
  try {
    const shippingRecord = await EmployeeShipping.findOneAndUpdate(
      { orderId: req.params.orderId },
      { status: req.body.status },
      { new: true }
    );

    if (!shippingRecord) {
      return res.status(404).json({ message: 'Shipping record not found' });
    }

    res.json(shippingRecord);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// ✅ Get employee performance stats
router.get('/performance/:employeeId', async (req, res) => {
  try {
    const stats = await EmployeeShipping.aggregate([
      {
        $match: {
          employeeId: new mongoose.Types.ObjectId(req.params.employeeId)
        }
      },
      {
        $group: {
          _id: null,
          totalOrders: { $sum: 1 },
          avgDeliveryTime: { $avg: "$deliveryTime" },
          avgRating: { $avg: "$customerRating" },
          delivered: {
            $sum: {
              $cond: [{ $eq: ["$status", "Delivered"] }, 1, 0]
            }
          }
        }
      }
    ]);

    // ✅ Attach recent records
    const recentRecords = await EmployeeShipping.find({
      employeeId: req.params.employeeId
    }).sort({ shippingDate: -1 }).limit(5);

    const finalStats = stats[0] || {};
    finalStats.recentRecords = recentRecords;

    res.json(finalStats);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// ✅ Get all shipping records for charts
router.get('/:employeeId/records', async (req, res) => {
  try {
    const records = await EmployeeShipping.find({
      employeeId: req.params.employeeId
    });
    res.json(records);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
