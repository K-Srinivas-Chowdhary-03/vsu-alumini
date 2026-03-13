require('dotenv').config();
const mongoose = require('mongoose');
const dns = require('dns');

const uri = process.env.MONGO_URI;
console.log("Testing Connection to:", uri);

if (!uri) {
    console.error("MONGO_URI not found in .env");
    process.exit(1);
}

// Extract hostname from URI for DNS check
// Format usually: mongodb+srv://<user>:<pass>@<hostname>/...
const match = uri.match(/@([^/?]+)/);
const hostname = match ? match[1] : null;

if (hostname) {
    console.log(`Resolving DNS for hostname: ${hostname}`);
    dns.resolve(hostname, (err, addresses) => {
        if (err) {
            console.error("DNS Resolution Failed:", err);
            console.log("\nPOSSIBLE CAUSES:");
            console.log("1. Internet connection issues.");
            console.log("2. Firewall blocking DNS for MongoDB Atlas.");
            console.log("3. The cluster address is incorrect or deleted.");
        } else {
            console.log("DNS Resolution Successful. IP Addresses:", addresses);
            testMongooseConnection();
        }
    });
} else {
    console.log("Could not extract hostname, proceeding to Mongoose connection test...");
    testMongooseConnection();
}

function testMongooseConnection() {
    console.log("Attempting Mongoose connect...");
    mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 })
        .then(() => {
            console.log("SUCCESS: Mongoose connected successfully!");
            process.exit(0);
        })
        .catch(err => {
            console.error("Mongoose Connection Failed:", err.message);
            process.exit(1);
        });
}
