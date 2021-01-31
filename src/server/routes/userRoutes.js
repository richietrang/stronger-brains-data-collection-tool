const User = require('../models/userModel');
const express = require('express');
const userRoutes = express.Router();

userRoutes.route('/:id').get((req, res) => {
  User.findById(req.params.id, (err, user) => {
    if (err) {
      console.log(err);
    } else {
      res.json(user);
    }
  });
});

userRoutes.route('/add').post(async (req, res) => {
  let user = new User({
    email: req.body.email,
    password: req.body.password,
    first_name: req.body.first_name,
    last_name: req.body.last_name,
    incomplete_forms: [],
  });

  const signUpKeyCorrect = user.compareSignupPassword(req.body.sign_up_key);
  if(!signUpKeyCorrect) {
    return res.json({status: 401, err: 'Sign up key is not correct'});
  }

  const token = await user.generateAuthToken();
  await user.save((err) => {
    if(err){
      console.log(err);
      return;
    }
  });
  return res.json({status: 201, user, message: "User added successfully", token: token});
});

userRoutes.route('/update/:id/').post(async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.json({status: 401, err: 'Invalid user id'});
    } else {
      User.updateOne({_id: req.params.id}, req.body, (err, user) => {
        if (err) throw err;
        res.send({ status: 201, user });
      });
    }

  } catch (error) {
      res.status(400).send(error);
  }
});

userRoutes.route('/update-password/:id/').post(async (req, res) => {
  try {
    const currentPassword = req.body.password;
    const newPassword = req.body.newPassword;
    const user = await User.findById(req.params.id);
    if (!user) {
      return res.json({status: 401, err: 'Invalid user id'});
    } else {
      await user.comparePassword(currentPassword, function(err, isMatch) {
        if (err) {
          return res.json({status: 401, err: 'Password is incorrect'});
        }

        if (!isMatch) {
          return res.json({status: 401, err: 'Invalid password'});
        } else {
          user.password = newPassword;
          user.save();
          res.send({ status: 201, user });
        }
      });
    }

  } catch (error) {
      res.status(400).send(error);
  }
});

userRoutes.post('/login', async(req, res) => {
  try {
      const { email, password } = req.body;
      const user = await User.findOne({ email} );
      if (!user) {
        return res.json({status: 401, err: 'Invalid email'});
      } else {
        await user.comparePassword(password, function(err, isMatch) {
          if (err) throw err;
  
          if (!isMatch) {
            return res.json({status: 401, err: 'Invalid password'});
          }
        });
        const token = await user.generateAuthToken();
        res.send({ status: 201, user, token });
      }
  } catch (error) {
      res.status(400).send(error);
  }
});

module.exports = userRoutes;
