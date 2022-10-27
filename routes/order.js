const express = require('express');
const router = express.Router();
const orderSchems = require('../modules/order')
const orderItemSchema = require('../modules/order-item')


router.get('/', async (req,res) => {
    const orderList = await orderSchems.find().populate('user', 'name')
                            .sort({'dateOrdered':-1});

    if(!orderList){
        res.status(500).json({success:false})
    }
    res.send(orderList);
})

router.get('/:id', async (req,res) => {
    const order = await orderSchems.findById(req.params.id)
        .populate('user', 'name')
        .populate('orderItems')
        // .populate({ path:'orderItems', populate:{path: 'Product', populate:'category'}});

    if(!order){
        res.status(500).json({success:false})
    }
    res.send(order);
})

router.post("/", async (req,res) => {
    const orderItemsIds = Promise.all(req.body.orderItems.map(async orderitem => {
        let newOrderItem = new orderItemSchema({
            quantity: orderitem.quantity,
            product: orderitem.product
        })

        newOrderItem = await newOrderItem.save();
        return newOrderItem._id;
    }));
    const orderItemsIdsResolved = await orderItemsIds;
    console.log(orderItemsIdsResolved)

    // const totalPrices = await Promise.all(orderItemsIdsResolved.map(async (orderItemId)=>{
    //     const orderItem = await orderItemSchema.findById(orderItemId).populate('product', 'price')
    //     const totalPrice = orderItem.product.price * orderItem.quantity;
    //     return totalPrice;
    // }));
    // const totalPrice = totalPrices.reduce((a,b) => a+b, 0);
    // console.log(totalPrices);

    let order = new orderSchems({
        orderItems:orderItemsIdsResolved,
        shippingAddress1:req.body.shippingAddress1,
        shippingAddress2:req.body.shippingAddress2,
        city:req.body.city,
        zip:req.body.zip,
        country:req.body.country,
        phone:req.body.phone,
        status:req.body.status,
        // totalPrice:totalPrice,
        totalPrice:req.body.totalPrice,
        user:req.body.user,
    })
    order = await order.save();

    if(!order)
        return res.status(404).send("Order not created");
    res.send(order);
});

router.put('/:id', async (req,res) => {
    const order = await orderSchems.findByIdAndUpdate(
        req.params.id, {
            status:req.body.status
        },{new:true})
    if(!order)
        return res.status(400).send("Order cannot be updated");
    res.send(order);
});

// router.delete('/:id', (req,res) => {
//     orderSchems.findByIdAndRemove(req.params.id)
//         .then(order=>{
//             if(order){
//                 return res.status(200).json('Order deleted')
//             }else{
//                 return res.status(404).json({success:false, message:'Order not found'})
//             }
//         }).catch(err=>{
//             return res.status(400).json({success:false, error:err});
//         })
// });

//Delete orderItems after deleted an order
router.delete('/:id', (req,res) => {
    orderSchems.findByIdAndRemove(req.params.id)
        .then(async order=>{
            if(order){
                await order.orderItems.map(async orderItem => {
                    await OrderItem.findByIdAndRemove(orderItem)
                })
                return res.status(200).json('Order deleted')
            }else{
                return res.status(404).json({success:false, message:'Order not found'})
            }
        }).catch(err=>{
            return res.status(400).json({success:false, error:err});
        })
});

//total shell in e-shop
router.get('/get/totalSales', async (req,res) => {
    const totalSales = await orderSchems.aggregate([
        {$group: {_id:null, totalSales: {$sum: '$totalPrice'}}}
    ])
    if(!totalSales){
        return res.status(400).send("The order sales cannot be generated")
    }
    res.send({totalSales: totalSales.pop().totalSales});
});

router.get("/get/count",async (req, res) => {
    const orderCount = await orderSchems.countDocuments((count)=>count)
    if(!orderCount){
        res.status(500).json({success:false});
    }
    res.send({orderCount:orderCount});
});

//user order history
router.get('/get/userorders/:userid', async (req,res) => {
    const userOrderList = await orderSchems.find({user: req.params.userid})
    .populate({
        path: 'orderItems', populate:{
            path: 'product', populate:'category'
        }
    }).sort({'dateOrdered':-1});

    if(!userOrderList){
        res.status(500).json({success:false})
    }
    res.send(userOrderList);
})


module.exports = router;