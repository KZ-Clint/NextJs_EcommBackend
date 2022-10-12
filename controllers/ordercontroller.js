const mongoose = require('mongoose')
const Eorder = require('../models/orderModel')
const Eproduct = require('../models/productModel')

const createOrder = async (req, res) => {

   try{ 

    const {_id} = req.user
   
    const { address, mobile, cart, total} = req.body

    const newOrder = new Eorder( {
         user : _id, 
         address,
         mobile,
         cart,
         total 
    } )

     cart.filter( (item) => {
      return soldProductUpdate( item._id, item.quantity, item.inStock, item.sold )
     } )

        await newOrder.save()
      res.json( {
        msg: 'Order Successful!! we will contact you to confirm the order. ',
        newOrder
      })
     } catch (err) {
         res.status(500).json({ error : err.message })
     }
     console.log('order taken !!!!')

} 

const soldProductUpdate = async (id, quantity, oldInStock, oldSold) => {

   await Eproduct.findOneAndUpdate({ _id: id }, 
      { 
          inStock: (oldInStock - quantity ),
          sold : (quantity + oldSold),
      })

}

const getOrders = async (req,res) => {
  try{ 
    const {_id} = req.user
    const {role} = req.user
    const {root} = req.user

     let orders; 
    if(role !== 'admin' ) {
       orders = await Eorder.find({user: _id}).populate("user", "-password")
    }
    else {
      orders = await Eorder.find().populate("user", "-password")
    } 

    res.json({orders})

     } catch (err) {
         res.status(500).json({ error : err.message })
     }
     console.log('order gotten !!!!')
}

//UPDATING THE PAID STATE OF THE ORDER AND THE DETAILS OF PAYMENT
const updateOrders = async (req,res) => {
  try{ 

       const {_id, role } = req.user
      
       if(!mongoose.Types.ObjectId.isValid(req.params.id) ){
        return res.status(404).json({error : " No such id" })
     }
     
      if( role === 'user' ) {
         const { paymentId } = req.body
         await Eorder.findOneAndUpdate({_id: req.params.id }, {
       $set: {
          paid: true,
          dateOfPayment: new Date().toISOString(),
          paymentId: paymentId,
          method: 'Paypal'
       }  
     },  {new:true} )

     res.json({ msg: 'Payment success' })
      }

     } catch (err) {
         res.status(500).json({ error : err.message })
     }
     console.log('order updated !!!!')
}

//UPDATE THE DELIVERY STATE OF THE ORDER BY THE ADMIN
const adminUpdateOrders = async (req,res) => {
  try{ 

       const { role } = req.user

       if(!mongoose.Types.ObjectId.isValid(req.params.id) ){
        return res.status(404).json({error : " No such id" })
      }
      if( role !== 'admin' ) {
        return res.status(400).json({error: 'Authentication is not valid' })
      }
      
      const order = await Eorder.findOne({_id: req.params.id })
      if(order.paid) {
         await Eorder.findOneAndUpdate({ _id: req.params.id }, {
          $set: { delivered: true }  
         },  {new:true} )  
        res.json({
          msg: 'delivered successfully' ,
          result: {
            delivered: true,
            paid: true,
            dateOfPayment: order.dateOfPayment,
            method: order.method,
          }
        })
      } else {
         await Eorder.findOneAndUpdate({ _id: req.params.id }, {
          $set: {         
              paid: true,
              dateOfPayment: new Date().toISOString(),
              method: 'Recieve Cash' ,
              delivered: true   
          }  },  {new:true} )  
         res.json({ 
          msg: 'delivered successfully',
          result: {
            paid: true,
            dateOfPayment: new Date().toISOString(),
            method: 'Recieve Cash',
            delivered: true   
          }
        })
      }   
     } catch (err) {
         res.status(500).json({ error : err.message })
     }
     console.log('order updated !!!!')
}


module.exports = {
    createOrder,
    getOrders,
    updateOrders,
    adminUpdateOrders
}