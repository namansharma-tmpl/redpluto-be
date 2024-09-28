const db = require('../models/index');
const { Op } = require('sequelize');
const jwt = require('jsonwebtoken');

const login = async (req, res, next) => {
    try {
        const { loginString, password } = req.body;
        const user = await db.User.findOne({
            where: {
                [Op.or]: {
                    username: loginString,
                    email: loginString,
                    phone: loginString,
                }
            }
        });
        if (!user){
            return res.status(400).json({ msg: 'No user exists with the given username, phone or email'});
        }
        if (user.password !== password){
            return res.status(400).json({ msg: "Invalid password"});
        }
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '4h' });
        return res.status(200).json({ user, token });
    }
    catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

const register = async (req, res, next) => {
    try {
        const { username, password, email } = req.body;
        if (!username || typeof(username) !== 'string' || username.length <= 2 || !password || !typeof(password) || password.length < 2){
            return res.status(400).json({ msg: "Invalid username or password" });
        }
        const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!email || !emailRegex.test(email)){
            return res.status(400).json({ msg: "Invalid email"});
        }
        const user = await db.User.create({
            username,
            password,
            email,
        });
        const token = jwt.sign({ id: user.user_id }, process.env.JWT_SECRET, { expiresIn: '4h' });
        return res.status(200).json({ user, token });
    }
    catch (err){
        console.log(err);
        return res.status(500).json({ msg: "Internal Server Error" });
    }
}

module.exports = {
    login,
    register,
}