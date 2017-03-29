var mongoose = require('mongoose');

var schema = mongoose.Schema({

    file: {
        type: String,
        required: true
    },
    userId: {
        type: String,
        required: true
    },
    category: {
        type: String,
        required: true
    },
    active : {
        type: Boolean,
    },
    votes: [{
        userVotingId: {
            type: String,
            required: true
        },
        comment: {
            type: String,
            required: true
        },            
        atractive: {
            type: Number,
            required: true
        },
        smart: {
            type: Number,
            required: true
        },
        trustworthy: {
            type: Number,
            required: true
        }                        
    }]

});

mongoose.model('Tests', schema);