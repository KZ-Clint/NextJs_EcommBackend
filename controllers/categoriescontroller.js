const mongoose = require('mongoose')
const Ecategories = require('../models/categoriesModel')
const Eproduct = require('../models/productModel')

const createCategory = async (req, res) => {

    try{ 
        const { role } = req.user
        if(role !== 'admin' ) {
            return  res.status(500).json({ error : 'Not an admin' })
        }

        const {name} = req.body
        if(!name) {
            return res.status(500).json({ error : 'Name cant be left blank' })
        }

        const newCategory = await Ecategories.create({name})

        res.json({
            msg: 'Success! created a new category',
            newCategory
        })

      } catch (err) {
          res.status(500).json({ error : err.message })
      }
      console.log('category created !!!!')
 
 } 

 const getCategories = async (req, res) => {

    try{ 
        const { role } = req.user
        // if(role !== 'admin' ) {
        //     return  res.status(500).json({ error : 'Not an admin' })
        // }
        
        const categories = await Ecategories.find()

        res.json({ categories })

      } catch (err) {
          res.status(500).json({ error : err.message })
      }
      console.log('category gotten !!!!')
 
 } 

 const putCategory = async (req, res) => {

    try{ 

        if(!mongoose.Types.ObjectId.isValid(req.params.id) ){
            return res.status(404).json({error : " No such id" })
        }

        const { role } = req.user
        const {name} = req.body
        if(role !== 'admin' ) {
            return  res.status(400).json({ error : 'Not an admin' })
        }
        
       const newCategory = await Ecategories.findOneAndUpdate({ _id : req.params.id }, {name},  {new:true} )

        res.json({ msg: 'Success!! Updated a new category',
                  newCategory })

      } catch (err) {
          res.status(500).json({ error : err.message })
      }
      console.log('category updated !!!!')
 
 } 

 const deleteCategory = async (req, res) => {

    try{ 
        const { role } = req.user
        if(role !== 'admin' ) {
            return res.status(500).json({ error : 'Not an admin' })
        }

        const {id} = req.params

        const products = await Eproduct.find({ category: id })
        console.log(products)
        if(products.length !== 0 ) {
            return res.status(500).json({ error : 'Please delete all products with a relationship' })
        }
        
         await Ecategories.findByIdAndDelete(id)

        res.json({ msg: "Success deleted a  category" })

      } catch (err) {
          res.status(500).json({ error : err.message })
      }
      console.log('category deleted !!!!')
 
 } 

 module.exports = {
    createCategory,
    getCategories,
    putCategory,
    deleteCategory
}