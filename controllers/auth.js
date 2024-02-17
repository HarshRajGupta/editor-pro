const User = require("../models/user");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = bcrypt.genSaltSync(10);
const { registrationMail } = require('./mail')

const registerUser = async (req, res) => {
    // console.log('POST /api/auth/register')
    try {
        console.log(req.body);
        const { userName, password } = req.body;
        const email = req.body.email.toLowerCase();
        if (!userName || !email || !password) return res.status(400).json({ success: false, message: 'Bad Request' })
        const prevUser = await User.findOne({ email });
        if (prevUser) {
            return res.status(400).json({ success: false, message: 'User already registered' })
        }
        const user = await User.create({
            userName,
            email,
            password: bcrypt.hashSync(password, bcryptSalt),
        });
        registrationMail(email, userName)
        jwt.sign(
            {
                email: user.email,
                id: user._id,
            },
            process.env.JWT_SECRET,
            (err, token) => {
                if (err) throw err;
                console.log(`DEBUG: User ${email} created`)
                return res.status(200).json({
                    success: true,
                    message: "Registration Successful",
                    user: user,
                    token: token
                });
            }
        );
    } catch (err) {
        console.log(`DEBUG: Error while registration`)
        console.error(err)
        return res.status(422).json({
            success: false,
            message: "Registration Failed",
            error: err
        });
    }
};

const loginUser = async (req, res) => {
    // console.log('POST /api/auth/login');
    try {
        console.log(req.body);
        const { password } = req.body;
        const email = req.body.email.toLowerCase();
        const user = await User.findOne({ email });
        if (user) {
            const passOk = bcrypt.compareSync(password, user.password);
            if (passOk) {
                jwt.sign(
                    {
                        email: user.email,
                        id: user._id,
                    },
                    process.env.JWT_SECRET,
                    (err, token) => {
                        if (err) throw err;
                        console.log(`DEBUG: User ${email} logged in`)
                        return res.status(200).json({
                            success: true,
                            message: "Logged in Successfully",
                            user: user,
                            token: token
                        });
                    }
                );
            } else {
                console.log(`DEBUG: Incorrect Password for ${email}`)
                return res.status(422).json({ success: false, message: "Incorrect Password" });
            }
        } else {
            console.log(`DEBUG: User ${email} not found`)
            return res.status(422).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        console.log(`DEBUG: Error logging in`);
        console.error(err)
        return res.status(404).json({ success: false, message: "Bad request", error: err });
    }
};

const verifyToken = (req, res) => {
    // console.log("POST /api/user/");
    try {
        console.log(req.body);
        const { token } = req.body;
        if (token) {
            jwt.verify(token, process.env.JWT_SECRET, async (err, userData) => {
                if (err) {
                    console.log(`DEBUG: Invalid Token`)
                    console.error(err)
                    return res.status(500).json({ success: false, error: `Invalid Token` });
                }
                const user = await User.findById(
                    userData.id
                );
                if (!user) {
                    console.log(`DEBUG: User not found`)
                    return res.status(404).json({ success: false, message: "User not found" });
                }
                const { userName, email, _id } = user;
                console.log(`DEBUG: User ${email} verified`)
                return res.status(200).json({
                    success: true, userName: userName, email: email, id: _id, message: `Welcome ${userName}!`
                });
            });
        } else {
            console.log(`DEBUG: No token found`)
            return res.res.status(500).json({
                success: false,
                message: "Please login"
            });
        }
    } catch (err) {
        console.log(`DEBUG: Error while verifying token`)
        console.error(err)
        return res.status(500).json({ success: false, error: err });
    }
}

module.exports = {
    registerUser,
    loginUser,
    verifyToken
}