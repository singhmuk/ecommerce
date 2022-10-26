const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const orderSchema = new Schema({
    name:{type:String},
    image:{type:String},
    countInStock:{type:Number},
})


module.exports = mongoose.model('order', orderSchema);