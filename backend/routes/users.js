const express = require('express');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const User = require('../models/user');


const router = express.Router();

router.post('/signup', (req, res, next) =>{
    bcrypt.hash(req.body.password, 10)
      .then(hash => {
        const user = new User({
          email: req.body.email,
          password: hash
        });
        user.save()
          .then(result => {
            res.status(200).json({
              message: 'sono la risposta 201 di router post signup',
              result: result
            });
          })
          .catch(err => {
            res.status(500).json({
              message: 'errore in fase di signup'
            })
          });
      });
});

router.post('/login', (req, res, next) => {
  let foundUser;
  User.findOne({email: req.body.email})
    .then(user => {
      if (!user)  {
        return res.status(401).json({message: 'Auth failed'});
      }
      foundUser = user;
      return bcrypt.compare(req.body.password, user.password);
    })
    .then(result => {

      if (!result) {
        return res.status(401).json({message: 'Auth failed'});
      }
      const token = jwt.sign({email:foundUser.email, userId: foundUser. _id}, 'secret_should_be_longer', {expiresIn: '1h'});
      res.status(200).json({message: 'auth success', token});
    })
    .catch(err => {
      console.log(err);
      return res.status(401).json({message: 'Auth failed'});
    })
})

module.exports = router;