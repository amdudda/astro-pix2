/**
 * Created by amdudda on 4/15/16.
 */
    // recycled from favecolors class exercise... leaving local in situ in case I decide to implement local accounts
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

var userSchema = mongoose.Schema({

    local : {
        username : String,
        password : String,
        displayName: String
    },

    twitter: {
        id : String,
        token : String,
        username : String,
        displayName : String
    },

    signUpDate : {
        type: Date,
        default: Date.now()
    },

    lastLogin : {
        type: Date,
        default: Date.now()
    },

    favorites: []
});

userSchema.methods.generateHash = function(password) {
    // create salted hash of pwd by hashing plaintext
    return bcrypt.hashSync(password, bcrypt.genSaltSync(8));
};

userSchema.methods.validPassword = function(password) {
    // hash entered pwd, compare with stored hash
    return bcrypt.compareSync(password, this.local.password);
};

module.exports = mongoose.model('User', userSchema);