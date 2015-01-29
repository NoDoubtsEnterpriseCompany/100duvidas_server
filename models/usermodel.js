/**
 * Created by jeymisson on 11/29/14.
 */
var bcrypt = require("bcrypt")
var mongoose = require('mongoose');

SALT_WORK_FACTOR = 10;

var UserSchema = new mongoose.Schema(
    {
        username: {type: String, required:true, unique: true},
        password: {type: String, required:true},
        email: {type: String, required: true, unique: true},
        profile: {
            name: String,
            age: Number,
            profilePic: String,
            gender: Number,
            degree: String,
            speciality: String,
            subjects: [{type:mongoose.Schema.Types.ObjectId, ref:"Subject", unique:true}],
			groupLecturesRegistered: [{type:mongoose.Schema.Types.ObjectId, ref:"GroupLecture"}],
			groupLecturesCreated: [{type:mongoose.Schema.Types.ObjectId, ref:"GroupLecture"}]
        }
    }
);

UserSchema.index({username: 1, email: 1}, {unique: true});

//Hash user password
UserSchema.pre('save', function(next) {
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

UserSchema.methods.checkChanges = function(cb){
    var user = this;
    if(user.isModified('username')) cb(new Error("Can't change user name"));
    if(user.isModified('email')) cb(new Error("Can't change email"));
    cb(null);
};

UserSchema.methods.comparePassword = function(candidatePassword, cb) {
    bcrypt.compare(candidatePassword, this.password, function(err, isMatch) {
        if (err) return cb(err);
        cb(null, isMatch);
    });
};

module.exports = mongoose.model("User", UserSchema);
