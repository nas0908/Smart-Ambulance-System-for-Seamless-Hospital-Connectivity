const express = require('express');
const Ambulance = require('../models/ambulance');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt'); // Require bcrypt

const router = express.Router();

// Get all ambulances (Admin only)
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const ambulances = await Ambulance.getAll();
        res.json(ambulances);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve ambulances' });
    }
});

// Create a new ambulance (Admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
    const { username, password, license_number } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the ambulance with the hashed password
        const result = await Ambulance.create(username, hashedPassword, license_number);
        res.status(201).json({ message: 'Ambulance created successfully!', ambulanceId: result.insertId });
    } catch (error) {
        console.error('Error creating ambulance:', error);
        res.status(500).json({ message: 'Failed to create ambulance' });
    }
});

// Update an existing ambulance (Admin only)
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { username, license_number } = req.body;

    try {
        await Ambulance.update(id, username, license_number);
        res.json({ message: 'Ambulance updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update ambulance' });
    }
});

// Delete an existing ambulance (Admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await Ambulance.delete(id);
        res.json({ message: 'Ambulance deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete ambulance' });
    }
});

module.exports = router;
