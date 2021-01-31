const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const SALT_WORK_FACTOR = 10;

let User = new Schema({
  first_name: {
    type: String,
    required: true,
  },
  last_name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
  },
  password: { 
    type: String, 
    required: true
  },
  tokens: [{
    token: {
        type: String,
        required: true
    }
  }],
  incomplete_forms: [{
    form_route: {
      type: String,
      required: true,
    },
    participant_group_id: {
      type: String,
      required: true,
    },
    participantId: {
      type: String,
      required: true,
    },
  }],
  last_group_selected: Schema.Types.ObjectId,
});


User.pre('validate', function(next) {
  var user = this;

  // only hash the password if it has been modified (or is new)
  if (!user.isModified('password')) return next();

  // generate a salt
  bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
    if (err) return next(err);

    // hash the password using our new salt
    bcrypt.hash(user.password, salt, function(err, hash) {
      if (err) return next(err);

      // override the cleartext password with the hashed one
      user.password = hash;
      next();
    });
  });
});

User.methods.comparePassword = function(candidatePassword, cb) {
  bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
    if (err) return cb(err);
    cb(null, isMatch);
  });
};

User.methods.compareSignupPassword = function(signUpKey) {
  let signUpTemporaryKey = 'becomeStrongerBrainsAdmin2020#';
  if (signUpTemporaryKey !== signUpKey) {
    return false;
  }
  return true;
};

User.methods.generateAuthToken = async function() {
  // Generate an auth token for the user
  const user = this;
  const token = jwt.sign({_id: user._id}, process.env.JWT_KEY);
  user.tokens = user.tokens.concat({token});
  await user.save();
  return token;
}

module.exports = mongoose.model('users', User);
