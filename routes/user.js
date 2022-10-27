const express = require('express');
const router = express.Router();
const userSchema = require('../modules/user')
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');


router.post('/register', async (req,res) => {
    const salt = await bcrypt.genSalt(10);
    const hashedPass = await bcrypt.hash(req.body.password, salt)

    let user = new userSchema({
        name: req.body.name,
        email: req.body.email,
        password: hashedPass,
        phone: req.body.phone,
        isAdmin: req.body.isAdmin,
        street: req.body.street,
        apartment: req.body.apartment,
        zip: req.body.zip,
        city: req.body.city,
        country: req.body.country,
    })
    user = await user.save();

    if(!user)
        return res.status(400).send('The user cannot be created')
    res.send(user);
})


router.get('/', async (req,res) => {
    const userList = await userSchema.find().select('-password');
    if(!userList){
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.get('/:id', async (req,res) => {
    const user = await userSchema.findById(req.params.id).select('-password');
    if(!user){
        res.status(500).json({message:'Given id not exist'});
    }
    res.status(200).send(user);
})

//Admin can see only some fields
router.get('/userList', async (req,res) => {
    const userList = await userSchema.find().select('name phone email');
    if(!userList){
        res.status(500).json({success: false})
    }
    res.send(userList);
})

router.post("/login", async (req, res) => {
        const user = await userSchema.findOne({email: req.body.email})
        const secret = process.env.secret;

        if(!user){
            return res.status(400).send('The user not found')
        }

        if(user && bcrypt.compareSync(req.body.password, user.password)){
            const token = jwt.sign({
                userId: user.id,
                isAdmin: user.isAdmin
            }, 
            secret, {expiresIn: '1d'})

            res.status(200).send({user: user.email, token: token})
        }else{
            res.status(200).send('Password is wrong');
        }
})

//counr users
router.get("/get/count",async (req, res) => {
    const userCount = await userSchema.countDocuments((count)=>count)
    if(!userCount){
        res.status(500).json({success:false});
    }
    res.send({userCount:userCount});
});

router.delete('/:id', (req,res) => {
    userSchema.findByIdAndRemove(req.params.id)
        .then(user=>{
            if(user){
                return res.status(200).json('User deleted')
            }else{
                return res.status(404).json({success:false, message:'User not found'})
            }
        }).catch(err=>{
            return res.status(400).json({success:false, error:err});
        })
});

module.exports = router;