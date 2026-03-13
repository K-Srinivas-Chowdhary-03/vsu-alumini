const registerUser = async (user) => {
    try {
        console.log(`Attempting to register: ${user.name} as ${user.role} (isAlumni: ${user.isAlumni})`);
        const res = await fetch('http://localhost:5000/api/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(user)
        });
        
        const data = await res.json();
        console.log('Response Status:', res.status);
        if (res.status === 201) {
            console.log('Success:', data.message);
            // Verify what was stored directly if possible or login? 
            // Since register doesn't return the user object (only message), 
            // we should try to login immediately to check the role.
            await loginUser(user.email, user.password);
        } else {
            console.log('Error:', data);
        }
    } catch (err) {
        console.error('Fetch Error:', err.message);
    }
};

const loginUser = async (email, password) => {
    try {
        const res = await fetch('http://localhost:5000/api/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password })
        });
        const data = await res.json();
        if (res.status === 200) {
            console.log(`Login Success for ${email}. Role received:`, data.user.role);
        } else {
            console.log('Login Failed:', data);
        }
    } catch (err) {
        console.error('Login Error:', err.message);
    }
}

const runTests = async () => {
    // 1. Test Student Registration
    console.log('\n--- Test 1: Student ---');
    await registerUser({
        name: "Test Student " + Date.now(),
        email: `student${Date.now()}@test.com`,
        password: "Password1!",
        role: "Student",
        isAlumni: false
    });

    // 2. Test Alumni Registration
    console.log('\n--- Test 2: Alumni ---');
    await registerUser({
        name: "Test Alumni " + Date.now(),
        email: `alumni${Date.now()}@test.com`,
        password: "Password1!",
        role: "Software Engineer",
        company: "Test Corp",
        isAlumni: true // simulating frontend payload
    });
};

runTests();
