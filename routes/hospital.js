const express = require('express');
const Hospital = require('../models/hospital');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');
const bcrypt = require('bcrypt'); // Require bcrypt

const router = express.Router();

// Get all hospitals (Admin only)
router.get('/', authenticateToken, authorizeAdmin, async (req, res) => {
    try {
        const hospitals = await Hospital.getAll();
        res.json(hospitals);
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to retrieve hospitals' });
    }
});

// Create a new hospital (Admin only)
router.post('/', authenticateToken, authorizeAdmin, async (req, res) => {
    const { username, password, hospital_name } = req.body;
    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);
        // Create the hospital with the hashed password
        const result = await Hospital.create(username, hashedPassword, hospital_name);
        res.status(201).json({ message: 'Hospital created successfully!', hospitalId: result.insertId });
    } catch (error) {
        console.error(err);
        res.status(500).json({ message: 'Failed to create hospital' });
    }
});

// Update an existing hospital (Admin only)
router.put('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    const { id } = req.params;
    const { username, hospital_name } = req.body;

    try {
        await Hospital.update(id, username, hospital_name);
        res.json({ message: 'Hospital updated successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to update hospital' });
    }
});

// Delete a hospital (Admin only)
router.delete('/:id', authenticateToken, authorizeAdmin, async (req, res) => {
    const { id } = req.params;

    try {
        await Hospital.delete(id);
        res.json({ message: 'Hospital deleted successfully!' });
    } catch (err) {
        console.error(err);
        res.status(500).json({ message: 'Failed to delete hospital' });
    }
});

module.exports = router;
