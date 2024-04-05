const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Notification = new Schema({
    notification:{
        type: String,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }
    }
);

module.exports = mongoose.model('Notification', Notification);

