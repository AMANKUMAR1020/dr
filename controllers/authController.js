const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Client_details = require('../model/Client_details')
const Dr_details = require('../model/Dr_details')

const login = async (req, res) => {
    const { name_or_email, password,isDoctor } = req.body

    if (!name_or_email || !password) {return res.status(400).json({ message: 'All fields are required' })}

    let foundUser
    if(isDoctor === false){
        foundUser = await Client_details.findOne({ $or: [{ email: name_or_email }, { name: name_or_email }] }).exec();
    }else{
        foundUser = await Dr_details.findOne({ $or: [{ email: name_or_email }, { name: name_or_email }] }).exec();
    }
    
    if (!foundUser) {return res.status(401).json({ message: `Unauthorized foundUser not found` })}

    const match = await bcrypt.compare(password, foundUser.pwd)

    if (!match) return res.status(401).json({ message: 'Unauthorized' })

    const accessToken = jwt.sign(
        {
            "UserInfo": {
                "name": foundUser.name,
                "email": foundUser.email
            }
        },
        process.env.ACCESS_TOKEN_SECRET,
        { expiresIn: '15m' }
    )

    const refreshToken = jwt.sign(
        { "name": foundUser.name },
        process.env.REFRESH_TOKEN_SECRET,
        { expiresIn: '7d' }
    )

    
    res.cookie('jwt', refreshToken, {
        httpOnly: true, //accessible only by web server 
        secure: true, //https
        sameSite: 'None', //cross-site cookie 
        maxAge: 7 * 24 * 60 * 60 * 1000 //cookie expiry: set to match rT
    })

    res.json({ accessToken })
}


const refresh = (req, res) => {
    const cookies = req.cookies

    if (!cookies?.jwt) return res.status(401).json({ message: 'Unauthorized' })

    const refreshToken = cookies.jwt

    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        async (err, decoded) => {
            if (err) return res.status(403).json({ message: 'Forbidden' })

            let foundUser
            if(isDoctor === false){foundUser = await Client_details.findOne({ name: decoded.name }).exec();}
            
            else{   foundUser = await Dr_details.findOne({ name: decoded.name }).exec();}
 //           const foundUser = await User.findOne({ name: decoded.name }).exec()

            if (!foundUser) return res.status(401).json({ message: 'Unauthorized' })

            const accessToken = jwt.sign(
                {
                    "UserInfo": {
                        "name": foundUser.name,
                        "email": foundUser.email
                    }
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: '15m' }
            )

            res.json({ accessToken })
        }
    )
}


const logout = (req, res) => {
    const cookies = req.cookies
    
    if (!cookies?.jwt) {
         return res.sendStatus(204)} //No content
    res.clearCookie('jwt', { httpOnly: true, sameSite: 'None', secure: true })
    res.json({ message: 'Cookie cleared' })
}

module.exports = {
    login,
    refresh,
    logout
}

