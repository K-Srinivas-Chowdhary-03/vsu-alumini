require('dotenv').config();
const mongoose = require('mongoose');

const uri = process.env.MONGO_URI;
console.log("Connecting to:", uri);

async function testConnection() {
    try {
        await mongoose.connect(uri);
        console.log("✅ Mongoose Connected");

        const state_codes = {
            0: "disconnected",
            1: "connected",
            2: "connecting",
            3: "disconnecting",
        };
        console.log("Connection State:", state_codes[mongoose.connection.readyState]);

        // Try to list collections
        const collections = await mongoose.connection.db.listCollections().toArray();
        console.log("✅ Collections found:", collections.map(c => c.name));

        // Try to insert a dummy doc to a test collection
        const testColl = mongoose.connection.db.collection('test_connectivity');
        await testColl.insertOne({ date: new Date(), check: "ok" });
        console.log("✅ Insert successful");

        process.exit(0);
    } catch (err) {
        console.error("❌ DB Operation Failed:", err);
        process.exit(1);
    }
}

testConnection();
