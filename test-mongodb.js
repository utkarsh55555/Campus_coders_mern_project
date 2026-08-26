const mongoose = require('mongoose');
require('dotenv').config();

console.log('Testing MongoDB connection...');
console.log('MONGO_URI:', process.env.MONGO_URI ? 'Set (hidden)' : 'Not set');

// Test 1: Basic connection
console.log('\n--- Test 1: Basic Connection ---');
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('✓ Connection successful!');
    mongoose.connection.close();
    process.exit(0);
  })
  .catch((error) => {
    console.log('✗ Connection failed:', error.message);
    console.log('Error name:', error.name);
    console.log('Error code:', error.code);
    
    // Test 2: DNS resolution
    console.log('\n--- Test 2: DNS Resolution ---');
    const dns = require('dns');
    dns.resolveSrv('_mongodb._tcp.cluster0.fedbqib.mongodb.net', (err, records) => {
      if (err) {
        console.log('✗ DNS SRV lookup failed:', err.message);
        console.log('Error code:', err.code);
        console.log('This is a DNS/network issue - NOT a code issue');
      } else {
        console.log('✓ DNS SRV lookup successful:', records);
      }
      process.exit(1);
    });
  });
