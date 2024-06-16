const jwt = require('jsonwebtoken')

const verifyJWT = (req, res, next) => {
    const authHeader = req.headers.authorization || req.headers.Authorization


    const token = authHeader.split(' ')[1]

    jwt.verify(
        token,
        process.env.ACCESS_TOKEN_SECRET,
        (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })
            req.userId = decoded.ClientInfo.userId;
            req.client = decoded.ClientInfo.clientname
            req.email = decoded.ClientInfo.email
            next()
        }
    )
}

module.exports = verifyJWT 