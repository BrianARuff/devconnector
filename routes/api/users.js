const express = require('express');
const router = express.Router();
const gravatar = require('gravatar');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const keys = require('../../config/keys');
const passport = require('passport');

// load input validation
const validateRegisterInput = require('../../validation/register');

// load user model with mongoose
const User = require('../../models/User');

// @route,       GET request in api/users/test
// @description, tests users route
// @access,      Public route
router.get('/test', (req, res) => res.json({msg: "Users works"}));

// @route,       GET request in api/users/register
// @description, register user
// @access,      Public route
router.post('/register', (req, res) => {
    const { errors, isValid } = validateRegisterInput(req.body);
    // check validation
    if(!isValid){
        return res.status(400).json(errors);
    }
    User.findOne({email: req.body.email})
        .then(user => {
            if(user) {
                return res.status(400).json({email: 'Email is already taken'})
            } else {
                const avatar = gravatar.url(req.body.email, {
                    s: '200',
                    r: 'pg',
                    d: 'mm'
                });

                const newUser = new User({
                    name: req.body.name,
                    email: req.body.email,
                    avatar,
                    password:  req.body.password
                });

                bcrypt.genSalt(10, (err, salt) => {
                    bcrypt.hash(newUser.password, salt, (err, hash) => {
                         if(err) throw err;
                         newUser.password = hash;
                         newUser.save()
                             .then(user => res.json(user))
                             .catch(err => console.log(err));
                    })
                })
            }
    })
});

// @route,       GET request in api/users/login
// @description, Login user / returning JWT token
// @access,      Public route
router.post('/login/',(req, res) => {
    const email = req.body.email;
    const password = req.body.password;
    // find user by email
    User.findOne({email})
        .then((user) => {
            // check for user
            if(!user){
                return res.status(404).json({email: 'User not found'})
            }
            // check for password
            bcrypt.compare(password, user.password)
                .then(isMatch => {
                    if(isMatch){
                        // user matched
                        //create jwt payload
                        const payload = {id: user.id, name: user.name, avatar: user.avatar};
                        // sign token
                        jwt.sign(
                            payload,
                            keys.secretOrKey,
                            {expiresIn: 3600},
                            (err, token) => {
                                res.json({
                                    success: true,
                                    token: `Bearer ${token}`
                                })
                        });
                    } else {
                        return res.status(400).json({password: 'Password incorrect'})
                    }
                })
        })
});

// @route,       GET request in api/users/current
// @description, return current user
// @access,      Private
router.get('/current',
    passport.authenticate('jwt', {session: false}),
    (req, res) => {
        res.json({
            id: req.user.id,
            name: req.user.name,
            email: req.user.email,
        });
});

module.exports = router;