const Client = require('../models/Client')
const Employee = require('../models/Employee')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')

// @desc Login
// @route POST /auth
// @access Public
const login = async (req, res) => {

    const { password , email, role } = req.body


    if (!password || !email || !role) {
        return res.status(400).json({ message: 'All fields are required' })
    }

    let foundUser;
    if (role === 'client') {
        foundUser = await Client.findOne({ email }).exec()
    } else if (role === 'employee') {
        foundUser = await Employee.findOne({ email }).exec()
    } else {
        return res.status(400).json({ message: 'Invalid role' })
    }

    if (!foundUser) {
        return res.status(401).json({ message: 'Unauthorized' })
    }

    const match = await bcrypt.compare(password, foundUser.password)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "ClientInfo": {
                "userId": foundUser._id,
                "clientname": foundUser.clientname || foundUser.employeename,
                "email": foundUser.email,
                "role": role,
                "stripeCustomerId": foundUser.stripeCustomerId,
                "_id": foundUser._id
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '1d' }
    )

    const refreshToken = jwt.sign(
        { "email": foundUser.email , "role": role },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    // Create secure cookie with refresh token 
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    // Send accessToken containing clientname and roles 
    res.json({ accessToken, userId: foundUser._id })
}

// @desc Refresh
// @route GET /auth/refresh
// @access Public - because access token has expired
const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            const { email, role } = decoded

            let foundUser;
            if (role === 'client') {
                foundUser = await Client.findOne({ email }).exec()
            } else if (role === 'employee') {
                foundUser = await Employee.findOne({ email }).exec()
            } else {
                return res.status(401).json({ message: 'Unauthorized' })
            }

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "ClientInfo": {
                        "clientname": foundUser.clientname || foundUser.employeename,
                        "email": foundUser.email,
                        "role": role,
                        "stripeCustomerId": foundUser.stripeCustomerId,
                        "_id": foundUser._id
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}

// @desc Logout
// @route POST /auth/logout
// @access Public - just to clear cookie if exists
const logout = (req, res) => {
    const cookies = req.cookies
    if (!cookies?.jwt) return res.sendStatus(204) //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}
