const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');
const fs = require('fs');
const db = require('./db');
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const customerRoutes = require('./routes/customer');

dotenv.config();

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
    origin: true, // Allow all origins in development
    credentials: true,
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Serve static files from uploads folder
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/customer', customerRoutes);

// Root route
app.get('/', (req, res) => {
    res.send('Karaama Restaurant API is running...');
});

// Database initialization
const initDB = async () => {
    try {
        // Ensure uploads directory exists
        const uploadsDir = path.join(__dirname, 'uploads');
        if (!fs.existsSync(uploadsDir)) {
            fs.mkdirSync(uploadsDir);
            console.log('Uploads directory created');
        }
        // Users table with roles
        await db.query(`
            CREATE TABLE IF NOT EXISTS users (
                id SERIAL PRIMARY KEY,
                username VARCHAR(50) UNIQUE NOT NULL,
                email VARCHAR(100) UNIQUE NOT NULL,
                password TEXT NOT NULL,
                role VARCHAR(20) DEFAULT 'customer', -- admin, manager, staff, customer
                phone VARCHAR(20),
                address TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Add address to users if it doesn't exist
        try { await db.query("ALTER TABLE users ADD COLUMN IF NOT EXISTS address TEXT"); } catch (e) { }

        // Categories table
        await db.query(`
            CREATE TABLE IF NOT EXISTS categories (
                id SERIAL PRIMARY KEY,
                name VARCHAR(100) NOT NULL,
                sort_order INTEGER DEFAULT 0,
                is_visible BOOLEAN DEFAULT TRUE,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Menu Items table
        await db.query(`
            CREATE TABLE IF NOT EXISTS menu_items (
                id SERIAL PRIMARY KEY,
                category VARCHAR(100),
                name VARCHAR(200) NOT NULL,
                description TEXT,
                price DECIMAL(10, 2) NOT NULL,
                image_url TEXT,
                availability BOOLEAN DEFAULT TRUE,
                discount_percentage DECIMAL(5, 2) DEFAULT 0,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Tables (for dine-in)
        await db.query(`
            CREATE TABLE IF NOT EXISTS restaurant_tables (
                id SERIAL PRIMARY KEY,
                table_number VARCHAR(10) UNIQUE NOT NULL,
                capacity INTEGER NOT NULL,
                status VARCHAR(20) DEFAULT 'Available', -- Available, Reserved, Occupied
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Orders table
        await db.query(`
            CREATE TABLE IF NOT EXISTS orders (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                table_id INTEGER REFERENCES restaurant_tables(id) ON DELETE SET NULL,
                total_amount DECIMAL(10, 2) NOT NULL,
                status VARCHAR(20) DEFAULT 'Pending', -- Pending, Accepted, Preparing, Ready, Delivered, Cancelled
                order_type VARCHAR(20) DEFAULT 'Dine-in', -- Dine-in, Takeaway, Delivery
                address TEXT, -- For delivery orders
                staff_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                payment_status VARCHAR(20) DEFAULT 'Unpaid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Check and add address column if it doesn't exist (for existing tables)
        try {
            await db.query("ALTER TABLE orders ADD COLUMN IF NOT EXISTS address TEXT");
        } catch (e) { /* ignore */ }

        // Order Items table
        await db.query(`
            CREATE TABLE IF NOT EXISTS order_items (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                menu_item_id INTEGER REFERENCES menu_items(id) ON DELETE SET NULL,
                quantity INTEGER NOT NULL,
                price DECIMAL(10, 2) NOT NULL
            );
        `);

        // Inventory table
        await db.query(`
            CREATE TABLE IF NOT EXISTS inventory (
                id SERIAL PRIMARY KEY,
                item_name VARCHAR(200) NOT NULL,
                quantity DECIMAL(10, 2) NOT NULL,
                unit VARCHAR(20) NOT NULL, -- kg, liters, units, etc.
                min_stock_level DECIMAL(10, 2) DEFAULT 5,
                last_updated TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Payments table
        await db.query(`
            CREATE TABLE IF NOT EXISTS payments (
                id SERIAL PRIMARY KEY,
                order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
                amount DECIMAL(10, 2) NOT NULL,
                payment_method VARCHAR(50) NOT NULL, -- Cash, Mobile Money, Card
                payment_status VARCHAR(20) DEFAULT 'Paid',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Reservations table
        await db.query(`
            CREATE TABLE IF NOT EXISTS reservations (
                id SERIAL PRIMARY KEY,
                customer_id INTEGER REFERENCES users(id) ON DELETE SET NULL,
                table_id INTEGER REFERENCES restaurant_tables(id) ON DELETE SET NULL,
                reservation_date DATE NOT NULL,
                reservation_time TIME NOT NULL,
                number_of_guests INTEGER NOT NULL,
                status VARCHAR(20) DEFAULT 'Confirmed',
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        // Settings table
        await db.query(`
            CREATE TABLE IF NOT EXISTS settings (
                key VARCHAR(100) PRIMARY KEY,
                value TEXT NOT NULL
            );
        `);

        // Feedback / Reviews table
        await db.query(`
            CREATE TABLE IF NOT EXISTS reviews (
                id SERIAL PRIMARY KEY,
                user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
                order_id INTEGER REFERENCES orders(id) ON DELETE SET NULL,
                rating INTEGER CHECK (rating >= 1 AND rating <= 5),
                comment TEXT,
                created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
            );
        `);

        console.log('PostgreSQL Database Schema Initialized');
    } catch (err) {
        console.error('Error initializing database:', err);
    }
};

const PORT = process.env.PORT || 5000;

app.listen(PORT, async () => {
    await initDB();
    console.log(`Server is running on port: ${PORT}`);
});
