const mongoose = require("mongoose");

const Schema = mongoose.Schema;
const userSchema = new Schema({
    googleId : {
        type : String,
        required:true
    },
    displayName : {
        type : String,
    },
    firstName : {
        type : String,
    },
    lastName : {
        type : String,
    },
  profileImage : {
        type : String,
    },
  createdAt : {
        type : Date,
        default : Date.now
    }
});

module.exports = mongoose.model("User" , userSchema);