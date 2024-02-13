const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth');
const jwt = require('jsonwebtoken');

//register endpoint
const registerUser = async (req, res) => {
    try {
        const {name, password} = req.body;

        //check if name is entered
        if(!name){
            return res.json({
                error: 'name is required'
            })
        }

        //check if password is good
        if(!password || password.length < 3){
            return res.json({
                error: 'need longer password'
            })
        }

        //check uniqueness of name
        const exist = await User.findOne({name});
        if (exist){
            return res.json({
                error: 'name is taken'
            })
        }

        const hashedPassword = await hashPassword(password);

        //create user
        const user = await User.create({
            name,
            password: hashedPassword
        })

        return res.json(user)

    } catch (err){
        console.log(err);
    }
}

//login endpoint
const loginUser = async (req, res) =>{
    try{
        const {name, password} = req.body;

        const user = await User.findOne({name});
        if(!user){
            return res.json({
                error: 'No user found'
            })
        }

        //check match
        const match = await comparePassword(password, user.password);
        if(match){
            jwt.sign({name: user.name, id: user._id}, process.env.JWT_SECRET, {}, (err, token)=>{
                if(err) throw err;
                res.cookie('token', token).json(user)
            })
        }else{
            res.json({
                error: 'Wrong password'
            })
        }
    } catch (err){
        console.log(err);
    }
}

// retrieve profile information
const getProfile = (req, res) =>{

    const {token} = req.cookies;

    if(token){
        jwt.verify(token, process.env.JWT_SECRET, {}, (err, user) =>{
            if(err) throw err;
            res.json(user);
        })
    } else {
        res.json(null);
    }

}

module.exports = {
    registerUser,
    loginUser,
    getProfile
}