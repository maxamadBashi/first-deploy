const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');

// --- Public Menu ---
router.get('/menu', async (req, res) => {
    try {
        const categories = await db.query('SELECT * FROM categories WHERE is_visible = TRUE ORDER BY CASE WHEN sort_order = 0 THEN 999 ELSE sort_order END ASC, name ASC');
        const items = await db.query('SELECT * FROM menu_items WHERE availability = TRUE');

        res.json({
            categories: categories.rows,
            items: items.rows
        });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Order Placement ---
router.post('/orders', authMiddleware, async (req, res) => {
    const { items, table_id, total_amount, order_type = 'Dine-in', address } = req.body;
    const customer_id = req.user.id;

    try {
        await db.query('BEGIN');

        // Added address column (will be handled as JSON or Text in DB updates)
        const orderResult = await db.query(
            'INSERT INTO orders (customer_id, table_id, total_amount, order_type, address, status, payment_status) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING id',
            [customer_id, table_id || null, total_amount, order_type, address || null, 'Pending', 'Unpaid']
        );
        const orderId = orderResult.rows[0].id;

        for (const item of items) {
            await db.query(
                'INSERT INTO order_items (order_id, menu_item_id, quantity, price) VALUES ($1, $2, $3, $4)',
                [orderId, item.id, item.quantity, item.price]
            );
        }

        await db.query('COMMIT');
        res.status(201).json({ message: 'Order created successfully', orderId });
    } catch (err) {
        await db.query('ROLLBACK');
        console.error('Order Error:', err);
        res.status(500).json({ message: err.message });
    }
});

// --- Reviews & Feedback ---
router.post('/reviews', authMiddleware, async (req, res) => {
    const { order_id, rating, comment } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO reviews (user_id, order_id, rating, comment) VALUES ($1, $2, $3, $4) RETURNING *',
            [req.user.id, order_id || null, rating, comment]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- My Orders ---
router.get('/my-orders', authMiddleware, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.*, 
            JSON_AGG(JSON_BUILD_OBJECT('name', mi.name, 'quantity', oi.quantity, 'price', oi.price)) as items
            FROM orders o
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            WHERE o.customer_id = $1
            GROUP BY o.id
            ORDER BY o.created_at DESC
        `, [req.user.id]);
        res.json(result.rows);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Table Reservation ---
router.post('/reservations', authMiddleware, async (req, res) => {
    const { table_id, reservation_date, reservation_time, number_of_guests } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO reservations (customer_id, table_id, reservation_date, reservation_time, number_of_guests) VALUES ($1, $2, $3, $4, $5) RETURNING *',
            [req.user.id, table_id || null, reservation_date, reservation_time, number_of_guests]
        );
        res.status(201).json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// --- Profile Update ---
router.patch('/profile', authMiddleware, async (req, res) => {
    const { username, phone, address, password } = req.body;
    const bcrypt = require('bcryptjs');

    try {
        let hashedPassword;
        if (password) {
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const result = await db.query(
            'UPDATE users SET username = COALESCE($1, username), phone = COALESCE($2, phone), address = COALESCE($3, address), password = COALESCE($4, password) WHERE id = $5 RETURNING id, username, email, phone, address, role',
            [username, phone, address, hashedPassword, req.user.id]
        );
        res.json(result.rows[0]);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
