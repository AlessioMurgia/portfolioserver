const User = require('../models/user');
const { hashPassword, comparePassword } = require('../helpers/auth')

const test = (req, res) => {
    res.json('test working')
}

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
            res.json('pwd match')
        }else{
            res.json({
                error: 'Wrong password'
            })
        }
    } catch (err){
        console.log(err);
    }
}

module.exports = {
    test,
    registerUser,
    loginUser
}