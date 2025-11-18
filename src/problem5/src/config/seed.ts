import pool from './database';

async function seed() {
  const client = await pool.connect();

  try {
    console.log('Seeding database with sample data...');

    // Check if data already exists
    const checkResult = await client.query('SELECT COUNT(*) as count FROM users');
    const count = parseInt(checkResult.rows[0].count);

    if (count > 0) {
      console.log(`Database already has ${count} users. Skipping seed.`);
      return;
    }

    // Sample users to insert
    const sampleUsers = [
      {
        name: 'John Doe',
        email: 'john.doe@example.com',
        age: 28,
        role: 'Developer',
        status: 'active',
      },
      {
        name: 'Jane Smith',
        email: 'jane.smith@example.com',
        age: 32,
        role: 'Designer',
        status: 'active',
      },
      {
        name: 'Bob Johnson',
        email: 'bob.johnson@example.com',
        age: 45,
        role: 'Manager',
        status: 'active',
      },
      {
        name: 'Alice Williams',
        email: 'alice.williams@example.com',
        age: 29,
        role: 'Developer',
        status: 'active',
      },
      {
        name: 'Charlie Brown',
        email: 'charlie.brown@example.com',
        age: 35,
        role: 'DevOps',
        status: 'active',
      },
      {
        name: 'Diana Prince',
        email: 'diana.prince@example.com',
        age: 27,
        role: 'Designer',
        status: 'active',
      },
      {
        name: 'Edward Norton',
        email: 'edward.norton@example.com',
        age: 41,
        role: 'Architect',
        status: 'active',
      },
      {
        name: 'Fiona Green',
        email: 'fiona.green@example.com',
        age: 30,
        role: 'QA Engineer',
        status: 'active',
      },
      {
        name: 'George Miller',
        email: 'george.miller@example.com',
        age: 38,
        role: 'Product Manager',
        status: 'inactive',
      },
      {
        name: 'Hannah Lee',
        email: 'hannah.lee@example.com',
        age: 26,
        role: 'Developer',
        status: 'active',
      },
      {
        name: 'Ian Thompson',
        email: 'ian.thompson@example.com',
        age: 33,
        role: 'Developer',
        status: 'active',
      },
      {
        name: 'Julia Roberts',
        email: 'julia.roberts@example.com',
        age: 29,
        role: 'UX Researcher',
        status: 'active',
      },
      {
        name: 'Kevin Hart',
        email: 'kevin.hart@example.com',
        age: 40,
        role: 'Manager',
        status: 'active',
      },
      {
        name: 'Laura Palmer',
        email: 'laura.palmer@example.com',
        age: 31,
        role: 'Data Analyst',
        status: 'active',
      },
      {
        name: 'Michael Scott',
        email: 'michael.scott@example.com',
        age: 42,
        role: 'Manager',
        status: 'inactive',
      },
    ];

    // Insert sample data
    for (const user of sampleUsers) {
      await client.query(
        `INSERT INTO users (name, email, age, role, status)
         VALUES ($1, $2, $3, $4, $5)`,
        [user.name, user.email, user.age, user.role, user.status]
      );
    }

    console.log(`✓ Successfully seeded ${sampleUsers.length} users`);
  } catch (error) {
    console.error('Seed error:', error);
    throw error;
  } finally {
    client.release();
  }
}

// Run seed if this file is executed directly
if (require.main === module) {
  seed()
    .then(() => {
      console.log('Seeding completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('Seeding failed:', error);
      process.exit(1);
    });
}

export default seed;
