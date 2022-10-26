const express = require('express');
const router = express.Router();
const productSchems = require('../modules/products')
const categorySchems = require('../modules/category')

router.post("/", async (req,res)=>{
    const category = await categorySchems.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')
      
    const newProduct = new productSchems(req.body);
    product = await newProduct.save();

    if(!product)
        return res.status(500).send('Product not found');
    res.send(product)
});

router.get("/", (req, res) => {
    productSchems.find()
                 .then(items=>res.status(200).json(items))
});

router.getById = async (req,res) => {
    const product = await productSchems.findById(req.params.id);
    if(!product){
        res.status(500).json({success:false});
    }
    res.send(product);
}

//get only name and image of products 
router.getname = async (req,res) => {
    const nameList = await productSchems.find().select('name image');
    res.send(nameList);
}

module.exports = router;