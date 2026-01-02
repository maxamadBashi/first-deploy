const express = require('express');
const router = express.Router();
const db = require('../db');
const authMiddleware = require('../middleware/authMiddleware');
const multer = require('multer');
const path = require('path');
const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');

// Configure Cloudinary
cloudinary.config({
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_API_SECRET
});

// Configure Cloudinary Storage
const cloudinaryStorage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'karaama_restaurant',
        allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
        public_id: (req, file) => Date.now() + '-' + path.parse(file.originalname).name
    }
});


// Configure Multer for image uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: (process.env.CLOUDINARY_CLOUD_NAME && process.env.CLOUDINARY_CLOUD_NAME !== 'youdetail')
        ? cloudinaryStorage
        : storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|webp/;
        const mimetype = filetypes.test(file.mimetype);
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Only images are allowed (jpg, jpeg, png, webp)'));
    }
});

// Middleware to check if user is admin or manager
const isAdmin = (req, res, next) => {
    console.log('isAdmin check - User:', req.user ? { id: req.user.id, role: req.user.role } : 'No user');
    if (req.user && (req.user.role === 'admin' || req.user.role === 'manager')) {
        next();
    } else {
        const userRole = req.user?.role || 'unknown';
        console.log(`Access denied for user with role: ${userRole}`);
        res.status(403).json({
            message: `Access denied. Admin or Manager role required. Your current role: ${userRole}`
        });
    }
};

// --- Dashboard Stats ---
router.get('/stats', authMiddleware, isAdmin, async (req, res) => {
    try {
        const salesToday = await db.query("SELECT SUM(total_amount) as total FROM orders WHERE created_at >= CURRENT_DATE AND status != 'Cancelled'");
        const totalOrders = await db.query("SELECT COUNT(*) as count FROM orders WHERE status != 'Cancelled'");
        const activeOrders = await db.query("SELECT COUNT(*) as count FROM orders WHERE status IN ('Pending', 'Accepted', 'Preparing', 'Ready')");
        const totalCustomers = await db.query("SELECT COUNT(*) as count FROM users WHERE role = 'customer'");

        const bestSelling = await db.query(`
            SELECT mi.name, SUM(oi.quantity) as total_sold 
            FROM order_items oi 
            JOIN menu_items mi ON oi.menu_item_id = mi.id 
            GROUP BY mi.id 
            ORDER BY total_sold DESC 
            LIMIT 5
        `);

        res.json({
            salesToday: salesToday.rows[0].total || 0,
            totalOrders: totalOrders.rows[0].count,
            activeOrders: activeOrders.rows[0].count,
            totalCustomers: totalCustomers.rows[0].count,
            bestSellingItems: bestSelling.rows
        });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Menu Management ---
router.get('/menu', authMiddleware, isAdmin, async (req, res) => {
    try {
        const categories = await db.query('SELECT * FROM categories ORDER BY sort_order ASC');
        const items = await db.query(`
            SELECT *, availability as is_available, discount_percentage as discount 
            FROM menu_items
        `);
        res.json({ categories: categories.rows, items: items.rows });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/categories', authMiddleware, isAdmin, async (req, res) => {
    const { name, sort_order } = req.body;
    try {
        const result = await db.query('INSERT INTO categories (name, sort_order) VALUES ($1, $2) RETURNING *', [name, sort_order || 0]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/categories/:id', authMiddleware, isAdmin, async (req, res) => {
    const { name, sort_order, is_visible } = req.body;
    try {
        const result = await db.query(
            'UPDATE categories SET name = COALESCE($1, name), sort_order = COALESCE($2, sort_order), is_visible = COALESCE($3, is_visible) WHERE id = $4 RETURNING *',
            [name, sort_order, is_visible, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/categories/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM categories WHERE id = $1', [req.params.id]);
        res.json({ message: 'Category deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/menu-items', authMiddleware, isAdmin, upload.single('image'), async (req, res) => {
    const { category_id, name, description, price, discount } = req.body;
    try {
        const catRes = await db.query('SELECT name FROM categories WHERE id = $1', [category_id]);
        const categoryName = catRes.rows.length > 0 ? catRes.rows[0].name : 'Uncategorized';

        let image_url = req.body.image_url || '';
        if (req.file) {
            // Cloudinary provides 'path' or 'secure_url'
            image_url = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;
        }

        const result = await db.query(
            'INSERT INTO menu_items (category, name, description, price, image_url, discount_percentage) VALUES ($1, $2, $3, $4, $5, $6) RETURNING *',
            [categoryName, name, description, price, image_url, discount || 0]
        );

        const newItem = {
            ...result.rows[0],
            is_available: result.rows[0].availability,
            discount: result.rows[0].discount_percentage
        };

        res.status(201).json(newItem);
    } catch (error) {
        console.error('Menu Item Create Error:', error);
        res.status(500).json({ message: error.message });
    }
});

router.patch('/menu-items/:id', authMiddleware, isAdmin, upload.single('image'), async (req, res) => {
    const { category_id, name, description, price, discount, is_available } = req.body;
    try {
        let categoryName;
        if (category_id) {
            const catRes = await db.query('SELECT name FROM categories WHERE id = $1', [category_id]);
            categoryName = catRes.rows.length > 0 ? catRes.rows[0].name : undefined;
        }

        let image_url;
        if (req.file) {
            // Cloudinary provides 'path' or 'secure_url'
            image_url = req.file.path || req.file.secure_url || `/uploads/${req.file.filename}`;
        }

        const result = await db.query(
            `UPDATE menu_items 
             SET category = COALESCE($1, category), 
                 name = COALESCE($2, name), 
                 description = COALESCE($3, description), 
                 price = COALESCE($4, price), 
                 image_url = COALESCE($5, image_url), 
                 discount_percentage = COALESCE($6, discount_percentage),
                 availability = COALESCE($7, availability)
             WHERE id = $8 RETURNING *`,
            [categoryName, name, description, price, image_url, discount, is_available, req.params.id]
        );

        const updatedItem = {
            ...result.rows[0],
            is_available: result.rows[0].availability,
            discount: result.rows[0].discount_percentage
        };

        res.json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/menu-items/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM menu_items WHERE id = $1', [req.params.id]);
        res.json({ message: 'Menu item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Order Management ---
router.get('/orders', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.*, u.username as customer_name, rt.table_number 
            FROM orders o 
            LEFT JOIN users u ON o.customer_id = u.id 
            LEFT JOIN restaurant_tables rt ON o.table_id = rt.id 
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/orders/:id/status', authMiddleware, isAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db.query('UPDATE orders SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Table Management ---
router.get('/tables', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM restaurant_tables ORDER BY table_number ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/tables', authMiddleware, isAdmin, async (req, res) => {
    const { table_number, capacity } = req.body;
    try {
        const result = await db.query('INSERT INTO restaurant_tables (table_number, capacity) VALUES ($1, $2) RETURNING *', [table_number, capacity]);
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/tables/:id', authMiddleware, isAdmin, async (req, res) => {
    const { table_number, capacity, status } = req.body;
    try {
        const result = await db.query(
            'UPDATE restaurant_tables SET table_number = COALESCE($1, table_number), capacity = COALESCE($2, capacity), status = COALESCE($3, status) WHERE id = $4 RETURNING *',
            [table_number, capacity, status, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/tables/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM restaurant_tables WHERE id = $1', [req.params.id]);
        res.json({ message: 'Table deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Staff Management ---
router.get('/staff', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await db.query("SELECT id, username, email, role, phone FROM users WHERE role IN ('admin', 'manager', 'staff')");
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/staff', authMiddleware, isAdmin, async (req, res) => {
    const { username, email, password, role, phone } = req.body;
    const bcrypt = require('bcryptjs');
    try {
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        const result = await db.query(
            'INSERT INTO users (username, email, password, role, phone) VALUES ($1, $2, $3, $4, $5) RETURNING id, username, email, role, phone',
            [username, email, hashedPassword, role, phone]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/staff/:id', authMiddleware, isAdmin, async (req, res) => {
    const { username, email, password, role, phone } = req.body;
    try {
        let hashedPassword;
        if (password) {
            const bcrypt = require('bcryptjs');
            const salt = await bcrypt.genSalt(10);
            hashedPassword = await bcrypt.hash(password, salt);
        }

        const result = await db.query(
            `UPDATE users 
             SET username = COALESCE($1, username), 
                 email = COALESCE($2, email), 
                 password = COALESCE($3, password), 
                 role = COALESCE($4, role), 
                 phone = COALESCE($5, phone)
             WHERE id = $6 RETURNING id, username, email, role, phone`,
            [username, email, hashedPassword, role, phone, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/staff/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM users WHERE id = $1 AND role IN (\'staff\', \'manager\', \'admin\')', [req.params.id]);
        res.json({ message: 'Staff member deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Inventory Management ---
router.get('/inventory', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await db.query('SELECT * FROM inventory ORDER BY item_name ASC');
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.post('/inventory', authMiddleware, isAdmin, async (req, res) => {
    const { item_name, quantity, unit, low_stock_threshold } = req.body;
    try {
        const result = await db.query(
            'INSERT INTO inventory (item_name, quantity, unit, min_stock_level) VALUES ($1, $2, $3, $4) RETURNING *',
            [item_name, quantity, unit, low_stock_threshold || 5]
        );
        res.status(201).json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/inventory/:id', authMiddleware, isAdmin, async (req, res) => {
    const { item_name, quantity, unit, low_stock_threshold } = req.body;
    try {
        const result = await db.query(
            `UPDATE inventory 
             SET item_name = COALESCE($1, item_name), 
                 quantity = COALESCE($2, quantity), 
                 unit = COALESCE($3, unit), 
                 min_stock_level = COALESCE($4, min_stock_level),
                 last_updated = CURRENT_TIMESTAMP 
             WHERE id = $5 RETURNING *`,
            [item_name, quantity, unit, low_stock_threshold, req.params.id]
        );
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.delete('/inventory/:id', authMiddleware, isAdmin, async (req, res) => {
    try {
        await db.query('DELETE FROM inventory WHERE id = $1', [req.params.id]);
        res.json({ message: 'Inventory item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Reservation Management ---
router.get('/reservations', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, u.username as customer_name, u.phone as customer_phone, rt.table_number 
            FROM reservations r
            LEFT JOIN users u ON r.customer_id = u.id
            LEFT JOIN restaurant_tables rt ON r.table_id = rt.id
            ORDER BY r.reservation_date DESC, r.reservation_time DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

router.patch('/reservations/:id', authMiddleware, isAdmin, async (req, res) => {
    const { status } = req.body;
    try {
        const result = await db.query('UPDATE reservations SET status = $1 WHERE id = $2 RETURNING *', [status, req.params.id]);
        res.json(result.rows[0]);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Customer Management ---
router.get('/customers', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT u.id, u.username, u.email, u.phone, u.address, u.created_at,
            (SELECT COUNT(*) FROM orders WHERE customer_id = u.id) as total_orders,
            (SELECT SUM(total_amount) FROM orders WHERE customer_id = u.id) as total_spent
            FROM users u
            WHERE u.role = 'customer'
            ORDER BY u.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Finance & Payments ---
router.get('/payments', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT o.id as order_id, o.total_amount, o.payment_status, o.created_at, u.username as customer_name
            FROM orders o
            LEFT JOIN users u ON o.customer_id = u.id
            WHERE o.payment_status = 'Paid'
            ORDER BY o.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// --- Review Management ---
router.get('/reviews', authMiddleware, isAdmin, async (req, res) => {
    try {
        const result = await db.query(`
            SELECT r.*, u.username, mi.name as item_name
            FROM reviews r
            LEFT JOIN users u ON r.user_id = u.id
            LEFT JOIN orders o ON r.order_id = o.id
            LEFT JOIN order_items oi ON o.id = oi.order_id
            LEFT JOIN menu_items mi ON oi.menu_item_id = mi.id
            ORDER BY r.created_at DESC
        `);
        res.json(result.rows);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

module.exports = router;
