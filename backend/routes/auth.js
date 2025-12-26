const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// POST /api/auth/register
router.post('/register', async (req, res) => {
    try {
        console.log('Registering user:', req.body.email);
        const { username, email, password } = req.body;

        if (!username || !email || !password) {
            return res.status(400).json({ message: 'All fields are required' });
        }

        // Check if user already exists
        const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userRes.rows.length > 0) {
            return res.status(400).json({ message: 'User already exists' });
        }

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create new user
        await db.query(
            'INSERT INTO users (username, email, password) VALUES ($1, $2, $3)',
            [username, email, hashedPassword]
        );

        console.log('User registered successfully:', email);
        res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
        console.error('Registration Error Details:', error);
        res.status(500).json({ message: 'Registration failed internal server error: ' + error.message });
    }
});

// POST /api/auth/login
router.post('/login', async (req, res) => {
    try {
        console.log('Login attempt:', req.body.email);
        const { email, password } = req.body;

        if (!email || !password) {
            return res.status(400).json({ message: 'Email and password are required' });
        }

        // Check user exists
        const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        if (userRes.rows.length === 0) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        const user = userRes.rows[0];

        // Check password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Invalid credentials' });
        }

        // Generate JWT
        const token = jwt.sign(
            { id: user.id, username: user.username },
            process.env.JWT_SECRET,
            { expiresIn: '1h' }
        );

        console.log('User logged in successfully:', email);
        res.json({
            token,
            user: {
                id: user.id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login Error Details:', error);
        res.status(500).json({ message: 'Login failed internal server error: ' + error.message });
    }
});

// GET /api/auth/profile (protected route)
router.get('/profile', authMiddleware, async (req, res) => {
    try {
        const userRes = await db.query('SELECT id, username, email, created_at FROM users WHERE id = $1', [req.user.id]);
        if (userRes.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }
        res.json(userRes.rows[0]);
    } catch (error) {
        console.error('Profile Fetch Error:', error);
        res.status(500).json({ message: 'Profile fetch failed' });
    }
});

module.exports = router;
