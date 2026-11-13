// Creates the first admin account from the .env values.
// Run with: npm run seed
// Safe to run many times - it will not create duplicates.
require('dotenv').config();
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const connectDB = require('../config/db');
const Admin = require('../models/Admin');

const run = async () => {
  const { ADMIN_USERNAME, ADMIN_PASSWORD } = process.env;
  if (!ADMIN_USERNAME || !ADMIN_PASSWORD) {
    console.error('Set ADMIN_USERNAME and ADMIN_PASSWORD in the .env file first.');
    process.exit(1);
  }

  await connectDB();

  const existing = await Admin.findOne({ username: ADMIN_USERNAME });
  if (existing) {
    console.log(`Admin "${ADMIN_USERNAME}" already exists. Nothing to do.`);
  } else {
    const hash = await bcrypt.hash(ADMIN_PASSWORD, 10);
    await Admin.create({ username: ADMIN_USERNAME, password: hash });
    console.log(`Admin "${ADMIN_USERNAME}" created.`);
  }

  await mongoose.disconnect();
};

run().catch((err) => {
  console.error('Seed failed:', err.message);
  process.exit(1);
});
