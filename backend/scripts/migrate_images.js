const { Client } = require('pg');

const client = new Client({
    connectionString: 'postgresql://neondb_owner:npg_uwDgQT56oSGW@ep-icy-cloud-a4o85n22-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require'
});

async function migrate() {
    try {
        await client.connect();

        // Update all menu items that have 'http://localhost:5000' in their image_url
        const res = await client.query(
            "UPDATE menu_items SET image_url = REPLACE(image_url, 'http://localhost:5000', '') WHERE image_url LIKE 'http://localhost:5000%'"
        );

        console.log(`Success: ${res.rowCount} items updated.`);

        // Also check for any other absolute URLs if necessary
        const res2 = await client.query(
            "SELECT id, image_url FROM menu_items WHERE image_url LIKE 'http%'"
        );
        if (res2.rows.length > 0) {
            console.log('Warning: Some items still have absolute URLs:', res2.rows);
        }

    } catch (err) {
        console.error('Migration failed:', err);
    } finally {
        await client.end();
    }
}

migrate();
