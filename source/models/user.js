var mongoose = require('mongoose');

var schema = mongoose.Schema({

    login: {
        type: String, 
        required: true
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String, 
        required: true
    },
    birthDate : {
        type : Date,
        required : true
    },
    score : {
        type : Number,
        required : false
    } 
});

mongoose.model('User', schema);