const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Notification = new Schema({
    notification:{
        type: String,
        required: true
    },
    created_at: {
        type: Date,
        default: Date.now
    },
    expires_at:{
        type: Date,
        required: true
    }

    }
);

module.exports = mongoose.model('Notification', Notification);

