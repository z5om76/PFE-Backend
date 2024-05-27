const express = require('express');
const jwt = require('jsonwebtoken');
const app = express();
const secretKey = 'your_secret_key';

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    // Validate user credentials (pseudo code)
    const user = validateUser(email, password);
    if (user) {
        const token = jwt.sign({ id: user.id, email: user.email }, secretKey, { expiresIn: '1h' });
        res.json({ token });
    } else {
        res.status(401).send('Invalid credentials');
    }
});

function validateUser(email, password) {
    // Implement your user validation logic
    return { id: 1, email }; // Example user object
}
