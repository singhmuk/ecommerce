const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const productSchema = new Schema({
    name:{type:String, required:true},
    description:{type:String, required:true},
    richDescription:{type:String, default:''},
    image:{type:String},
    images:[{type:String, default:''}],
    brand:{type:String, default:''},
    price:{type:Number, default:0},
    category:{type:mongoose.Schema.Types.ObjectId,
             ref:'Category', required:true
    },
    countInStock:{type:Number, required:true,min:0,max:255},
    rating:{type:Number, default:0},
    numReviews:{type:Number, default:0},
    isFeatured:{type:Boolean, default:false},
    dateCreated:{type:Date, default:Date.now},
});


//create product without _id
productSchema.virtual('id').get(function (){
    return this._id.toHexString();
});

productSchema.set('toJSON', {
    virtuals: true
})


module.exports = mongoose.model('Products', productSchema);