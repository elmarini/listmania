const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const SALT_WORK_FACTOR = 10;
const bcrypt = require('bcryptjs');



const userSchema = new Schema({
    username: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilepic: {type: String, required: false }
});

userSchema.pre('save', function (next) {
    let user = this;


    if (!user.isModified('password')) return next();
    bcrypt.genSalt(SALT_WORK_FACTOR, function (err, salt) {
        if (err) return next(err);
        bcrypt.hash(user.password, salt, function (err, hash) {
            if (err) return next(err);
            user.password = hash;
            next();
        });
    });

});

userSchema.methods.comparePassword = function (candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function (err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};


module.exports = mongoose.model('User', userSchema);
