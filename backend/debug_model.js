require('dotenv').config();
const mongoose = require('mongoose');
const Alumni = require('./models/Alumni');

async function testModel() {
    try {
        await mongoose.connect(process.env.MONGO_URI);
        console.log("✅ Mongoose Connected");

        console.log("Testing Alumni.findOne...");
        const result = await Alumni.findOne({ email: "nonexistent@test.com" });
        console.log("✅ Alumni.findOne result:", result); // Should be null

        process.exit(0);
    } catch (err) {
        console.error("❌ Model Operation Failed:", err);
        process.exit(1);
    }
}

testModel();
