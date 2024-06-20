const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
        return res.status(401).json({ message: 'Unauthorized: No token provided' });
    }

    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) {
                console.error('JWT verification error:', err);
                return res.status(403).json({ message: 'Forbidden' });
            }
            req.userId = decoded.ClientInfo.userId;
            req.client = decoded.ClientInfo.clientname
            req.email = decoded.ClientInfo.email
            next()
        }
    )
}

module.exports = verifyJWT 