var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var LocalUser = new Schema({
    username: String,
    password: String
});

LocalUser.plugin(passportLocalMongoose);


var FacebookUserSchema = new Schema({
	fbId: String,
	email: {type: String, lowercase: true},
	name: String
});


module.exports = {
	LocalUser: mongoose.model('LocalUser', LocalUser),
	FacebookUser: mongoose.model('FacebookUser', FacebookUserSchema)
};
