const express = require('express');
const router = express.Router();
const productSchems = require('../modules/products')
const categorySchems = require('../modules/category');
const mongoose = require('mongoose');
const multer = require('multer');

const FILE_TYPE_MAP = {
    'image/png':'png',
    'image/jpeg':'jpeg',
    'image/jpg':'jpg'
}

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        const isValid = FILE_TYPE_MAP[file.mimetype];
        let uploadError = new Error('invalid image type');

        if(isValid){
            uploadError = null;
        }
        cb(uploadError, '/public/uploads')
    },
    
    filename: function(req,file,cb){
        const fileName = file.originalname.split(' ').join('-');
        const extension = FILE_TYPE_MAP[file.mimetype];
        cb(null, `${fileName}-${Date.now()}.${extension}`)
    }
});

const uploadOptions = multer({storage:storage});


// router.post("/", async (req,res)=>{
//     const category = await categorySchems.findById(req.body.category);
//     if(!category) return res.status(400).send('Invalid Category')
      
//     const newProduct = new productSchems(req.body);
//     product = await newProduct.save();

//     if(!product)
//         return res.status(500).send('Product not found');
//     res.send(product)
// });

router.post("/", uploadOptions.single('image'), async (req,res)=>{
    const category = await categorySchems.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')
    const filename = req.body.filename;
    const basePath = `${req.protocol}://${req.get('host')}/public/upload/`;

    let product = new productSchems({
        name:req.body.name,
        description:req.body.description ,
        richDescription:req.body.richDescription,
        image:`${basePath}${filename}`,
        brand:req.body.brand ,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock ,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured ,
    })
      
    // const newProduct = new productSchems(req.body);
    product = await newProduct.save();

    if(!product)
        return res.status(500).send('Product not found');
    res.send(product)
});

router.get("/",async (req, res) => {
    const product = await productSchems.find().populate('category');
    res.send(product);
});

router.get("/:id",async (req, res) => {
    const product = await productSchems.findById(req.params.id)
    .populate('category');
    if(!product){
        res.status(500).json({success:false});
    }
    res.send(product);
});

//get only name and image of products 
router.get("/name",async (req, res) => {
    const nameList = await productSchems.find().select('name image -_id');
    res.send(nameList);
});

router.put("/:id",async (req, res) => {
    if(!mongoose.isValidObjectId(req.params.id)){
        res.status(400).send('Invalid Product Id')
    }
    const category = await categorySchems.findById(req.body.category);
    if(!category) return res.status(400).send('Invalid Category')

    const product = await productSchems.findByIdAndUpdate(req.params.id, {
        name:req.body.name,
        description:req.body.description ,
        richDescription:req.body.richDescription,
        image:req.body.image,
        brand:req.body.brand ,
        price:req.body.price,
        category:req.body.category,
        countInStock:req.body.countInStock ,
        rating:req.body.rating,
        numReviews:req.body.numReviews,
        isFeatured:req.body.isFeatured ,
    },{new: true});

    if(!product) 
        return res.status(500).send('Product cannot be updated')
    res.send(product)
});

router.delete('/:id', (req,res) => {
    productSchems.findByIdAndRemove(req.params.id)
        .then(product=>{
            if(product){
                return res.status(200).json('Product deleted')
            }else{
                return res.status(404).json({success:false, message:'Product not found'})
            }
        }).catch(err=>{
            return res.status(400).json({success:false, error:err});
        })
});

router.get("/get/count",async (req, res) => {
    const productCount = await productSchems.countDocuments((count)=>count)
    if(!productCount){
        res.status(500).json({success:false});
    }
    res.send({productCount:productCount});
});

router.get("/get/features",async (req, res) => {
    const product = await productSchems.find({isFeatured:true})
    if(!product){
        res.status(500).json({success:false});
    }
    res.send(product);
});

//localhost:5000/api/v1/products/getFeatures/2
router.get("/get/features/:count",async (req, res) => {
    const count = req.params.count ? req.params.count : 0
    const product = await productSchems.find({isFeatured:true}).limit(+count)
    if(!product){
        res.status(500).json({success:false});
    }
    res.send(product);
});

//filter
router.get("/filter",async (req, res) => {
    let filter = {};
    if(req.query.category){
        filter = {category: req.query.category.split(',')}
    }

    const product = await productSchems.find(filter).populate('category');
    res.send(product);
});

module.exports = router;