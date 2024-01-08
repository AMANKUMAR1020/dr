
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        require:true
    },
    pwd:{
        type:String,
        require:true
    },
    isDoctor:{
        type:Boolean,
        require:true
    },
    picture:{
        data: Buffer,
        contentType: String
    },
    refreshToken:{string:String}
})

module.exports = mongoose.model('users',userSchema)