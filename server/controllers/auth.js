const { User, Connection } = require("../models");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bcryptSalt = bcrypt.genSaltSync(10);
const { registrationMail } = require("./mail");

const register = async (req, res) => {
    try {
        const { name, password } = req.body;
        const email = req.body.email.toLowerCase();
        if (!name || !email || !password) return res.status(400).json({ success: false, message: "Bad Request" });
        const prevUser = await User.findOne({ where: { email } });
        if (prevUser) return res.status(400).json({ success: false, message: "User already registered" });
        let user = req.user;
        if (user) {
            await user.update({ name, email, password: bcrypt.hashSync(password, bcryptSalt) });
        } else {
            user = await User.create({
                name,
                email,
                password: bcrypt.hashSync(password, bcryptSalt),
            });
        }
        await Connection.update(
            { userId: user.id },
            { where: { email } }
        )
        registrationMail(email, name);
        jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            (err, token) => {
                if (err) throw err;
                return res.status(200).json({
                    success: true,
                    message: "Registration Successful",
                    user: user,
                    token: token,
                });
            },
        );
    } catch (err) {
        console.error("DEBUG: Error while registration", err);
        return res.status(422).json({
            success: false,
            message: "Registration Failed",
            error: err,
        });
    }
};

const login = async (req, res) => {
    try {
        const { password } = req.body;
        const email = req.body.email.toLowerCase();
        const user = await User.findOne({ email });
        if (user) {
            const passOk = bcrypt.compareSync(password, user.password);
            if (passOk) {
                jwt.sign(
                    { id: user.id },
                    process.env.JWT_SECRET,
                    (err, token) => {
                        if (err) throw err;
                        return res.status(200).json({
                            success: true,
                            message: "Logged in Successfully",
                            user: user,
                            token: token,
                        });
                    },
                );
            } else {
                return res.status(422).json({ success: false, message: "Incorrect Password" });
            }
        } else {
            return res.status(404).json({ success: false, message: "User not found" });
        }
    } catch (err) {
        console.error("DEBUG: Error logging in", err);
        return res
            .status(404)
            .json({ success: false, message: "Bad request", error: err });
    }
};

const verify = async (req, res) => {
    try {
        const user = req.user
        res.status(200).json({ success: true, message: `Welcome ${user.name}`, user });
    } catch (err) {
        console.error("DEBUG: Error while verifying token", err);
        return res.status(500).json({ success: false, error: err });
    }
};

const guest = async (req, res) => {
    try {
        var user = req.user;
        if (!user) {
            user = await User.create({})
        }
        jwt.sign(
            { id: user.id },
            process.env.JWT_SECRET,
            (err, token) => {
                if (err) throw err;
                res.cookie("guestId", token, {
                    secure: true,
                    httpOnly: true
                });
                return res.status(200).json({
                    success: true,
                    message: "Guest Logged in Successfully",
                    user: user,
                    token: token,
                });
            },
        );
    } catch (err) {
        console.error("Error: Guest logging in", err);
        return res
            .status(400)
            .json({ success: false, message: "Bad request", error: err });
    }
};

module.exports = {
    register,
    login,
    verify,
    guest,
};
