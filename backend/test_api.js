const API_URL = 'http://localhost:5001/api';

async function testAuth() {
    const testUser = {
        name: "Test User",
        email: `test_${Date.now()}@test.com`,
        password: "Password@123",
        role: "Student",
        isAlumni: false
    };

    console.log("1. Testing Registration...");
    console.log("Payload:", testUser);

    try {
        const regRes = await fetch(`${API_URL}/register`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(testUser)
        });
        const regData = await regRes.json();
        
        if (regRes.ok) {
            console.log("✅ Registration Success:", regData);
        } else {
            console.error("❌ Registration Failed:", regData);
            return;
        }

        console.log("\n2. Testing Login...");
        const loginRes = await fetch(`${API_URL}/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: testUser.email, password: testUser.password })
        });
        const loginData = await loginRes.json();

        if (loginRes.ok) {
            console.log("✅ Login Success:", loginData);
        } else {
            console.error("❌ Login Failed:", loginData);
        }

    } catch (err) {
        console.error("❌ Network/Server Error:", err.message);
    }
}

testAuth();
