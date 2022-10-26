const express = require('express');
const router = express.Router();
const categorySchems = require('../modules/category')

router.get("/", async (req,res) => {
    const categoryList = await categorySchems.find();
    if(!categoryList){
        res.status(500).json({success:false})
    }
    res.status(200).send(categoryList)
});

router.get('/:id', async (req,res) => {
    const category = await categorySchems.findById(req.params.id);
    if(!category){
        res.status(500).json({message:'Given id not exist'});
    }
    res.status(200).send(category);
})

router.post("/", async (req,res) => {
    let newCategory = new categorySchems({
        name:req.body.name,
        icon:req.body.icon,
        color:req.body.color,
    })
    category = await newCategory.save();

    if(!category)
        return res.status(404).send("Category not created");
    res.send(category);
});

router.delete('/:id', (req,res) => {
    categorySchems.findByIdAndRemove(req.params.id)
        .then(cate=>{
            if(cate){
                return res.status(200).json('Category deleted')
            }else{
                return res.status(404).json({success:false, message:'Category not found'})
            }
        }).catch(err=>{
            return res.status(400).json({success:false, error:err});
        })
});

router.put('/:id', async (req,res) => {
    const category = await categorySchems.findByIdAndUpdate(
        req.params.id, {
            name:req.body.name,
            icon:req.body.icon,
            color:req.body.color,
        },{new:true})
    if(!category)
        return res.status(400).send("Category cannot be updated");
    res.send(category);
})

module.exports = router;