app.get('/protected', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route', user: req.user });
});

function verifyToken(req, res, next) {
    const token = req.headers['authorization']?.split(' ')[1];
    if (!token) return res.status(403).send('Token is required.');

    jwt.verify(token, secretKey, (err, decoded) => {
        if (err) return res.status(401).send('Invalid token.');
        req.user = decoded;
        next();
    });
}
