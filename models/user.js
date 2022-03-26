const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const passportLocalMongoose = require('passport-local-mongoose');

const UserSchema = new Schema({
    username : {
        type : String,
        required : true,
        unique : true
    },
    branch : {
        type : String,
        required : true
    },
    degree : {
        type : String,
        required : true
    },
    graduationYear : {
        type : Number,
        required : true
    }
});

UserSchema.plugin(passportLocalMongoose);

module.exports = mongoose.model('User',UserSchema);