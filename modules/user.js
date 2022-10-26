const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
    name:{type:String},
    image:{type:String},
    countInStock:{type:Number},
})


module.exports = mongoose.model('User', userSchema);