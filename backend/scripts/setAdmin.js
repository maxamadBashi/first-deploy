const db = require('../db');
require('dotenv').config();

// Usage: node scripts/setAdmin.js <email>
const email = process.argv[2];

if (!email) {
    console.error('Usage: node scripts/setAdmin.js <email>');
    console.error('Example: node scripts/setAdmin.js admin@example.com');
    process.exit(1);
}

async function setAdmin() {
    try {
        // Check if user exists
        const userRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
        
        if (userRes.rows.length === 0) {
            console.error(`User with email ${email} not found.`);
            process.exit(1);
        }

        const user = userRes.rows[0];
        console.log(`Current user: ${user.username} (${user.email}) - Role: ${user.role}`);

        // Update user role to admin
        await db.query('UPDATE users SET role = $1 WHERE email = $2', ['admin', email]);
        
        console.log(`✓ Successfully updated ${email} to admin role.`);
        console.log('Please log out and log back in for the changes to take effect.');
        process.exit(0);
    } catch (error) {
        console.error('Error:', error.message);
        process.exit(1);
    }
}

setAdmin();

