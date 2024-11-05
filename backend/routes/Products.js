const express = require('express');
const router = express.Router();
const Product = require('../models/Products');  
const { sendOrderConfirmation } = require('../emailService');
const Order = require('../models/Order');
const Products = require('../models/Products');
router.get('/GetImages', async (req, res) => {
    try {
      const products = await Product.find();
      res.json(products);
    } catch (err) {
      console.error(err);
      res.status(500).send('Server Error');
    }
  });


  router.get('/order_status', async (req, res) => {
    try {
      const orders = await Order.find();  
      res.status(200).json({ data: orders, message: 'Orders fetched successfully' });
    } catch (error) {
      console.error('Error fetching orders:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  });
  







  router.put('/orders/:id/status', async (req, res) => {
    const { status } = req.body;  // 'packed', 'outForDelivery'
    try {
      const order = await Order.findById(req.params.id);
      if (!order) return res.status(404).json({ error: 'Order not found' });
      
      order.status = status;
      await order.save();
      
      res.status(200).json({ message: 'Order status updated' });
    } catch (err) {
      res.status(500).json({ error: 'Failed to update order status' });
    }
  });
  
  router.post('/placeOrder', async (req, res) => {
    const { userEmail, product, billingInfo } = req.body;
  
    try {
   
      const newOrder = new Order({
        username: billingInfo.fullName,
        email: userEmail,
        address: billingInfo.address,
        paymentMethod: billingInfo.paymentMethod,
        product: {
          name: product.name,
          price: product.price,
          image: product.image,
        }
      });
  
   
      await newOrder.save();
      // await sendOrderConfirmation(userEmail, product); 
       
  
  
    
      res.status(200).json({ message: 'Order placed and saved successfully!' });
    } catch (error) {
      console.error('Error placing order:', error);
      res.status(500).json({ error: 'Failed to place order' });
    }
  });
  

 router.get('/product_list',async(req,res)=>{
  try {
    const products= await Product.find()
    const result=products.length
    res.status(200).json({data: result,message:'successfully fetched'})
  } catch(error)  {
    res.status(400).json({error :'internal server error'})  }

 })


router.get('/order_list',async(req,res)=>{
  try {
    const order_data= await Order.find()
    const length_data=order_data.length
    res.status(200).json({response: length_data,messgae:'success'})
    
  } catch (error) {
    res.status(400).json({result : error,message:'internal server error '})
  }
})


module.exports = router;
