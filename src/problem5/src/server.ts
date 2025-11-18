import dotenv from 'dotenv';
import app from './app';
import migrate from './config/migrate';
import seed from './config/seed';
import pool from './config/database';

dotenv.config();

const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    // Wait for database connection
    await pool.query('SELECT NOW()');
    console.log('✓ Database connection established');

    // Run migrations
    await migrate();

    // Seed database with sample data (only if empty)
    await seed();

    // Start server
    app.listen(PORT, () => {
      console.log(`\n🚀 Server running on http://localhost:${PORT}`);
      console.log(`📚 API Documentation available at http://localhost:${PORT}/api-docs\n`);
    });
  } catch (error) {
    console.error('Failed to start server:', error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on('SIGINT', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  process.exit(0);
});

process.on('SIGTERM', async () => {
  console.log('\nShutting down gracefully...');
  await pool.end();
  process.exit(0);
});

startServer();
