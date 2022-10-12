const mongoose = require('mongoose')
const Eproduct = require('../models/productModel')


class APIfeatures {
   constructor(query, queryString) { 
   this.query = query;
   this.queryString = queryString;
   }
   filtering() {
      const queryObj = {...this.queryString}

      const excludeFields = ['page', 'sort', 'limit']
      excludeFields.forEach( (el) => {
         delete(queryObj[el]) } )

         if( queryObj.category !== 'all' ) {
            this.query.find({ category: queryObj.category })
         }
         if( queryObj.title !== 'all' ) {
            this.query.find({ title: { $regex: queryObj.title } })
         }
       this.query.find()
       return this;
   }
   sorting() {
      if(this.queryString.sort) {
         const sortBy = this.queryString.sort.split(',').join('')
         this.query = this.query.sort(sortBy)
      }else{
         this.query = this.query.sort('-createdAt')
      }
      return this;
   }
   paginating(){
      const page = this.queryString.page * 1 || 1
      const limit = this.queryString.limit * 1 || 6
      const skip = (page - 1) * limit;
      this.query = this.query.skip(skip).limit(limit)
      return this;
   }
}

const getProduct = async (req, res) => {
    try{
      const features = new APIfeatures(Eproduct.find(), req.query)
      .filtering().sorting().paginating()
      
      console.log(req.query)
        const products = await features.query
        res.status(200).json({ result: products.length,
                                products })
    } catch (err) {
        res.status(500).json({ error : err.message })
    }
    console.log('Product gotten!!!!')
}

//GET A SINGLE WORKOUT
const getSingleProduct =  async (req, res) => {

    if(!mongoose.Types.ObjectId.isValid(req.params.id) ){
        return res.status(404).json({error : " No such id" })
    }
    
    const products = await Eproduct.findById(req.params.id) 

     if(!products) {
      return  res.status(404).json({ error : "No such product" })
     }
     res.status(200).json({products})
     console.log('product specified!!!!')
}

//UPDATE PRODUCT
const updateProduct =  async (req, res) => {
    
      try{
         const {_id, role} = req.user
         if( role !== 'admin' ) {
            return  res.status(400).json({ error : "Not an admin" })
         }

         const {product_id, title, price, inStock, description, content, category,images} = req.body
         
         if( !product_id || !title || !price || !inStock || !description || !content || category === 'all' || images.length === 0 ) {
            return  res.status(404).json({ error : "Please add all the fields" })
         }

         await Eproduct.findOneAndUpdate({ _id: req.params.id }, { product_id, title: title.toLowerCase(), price, inStock, description, content, category,images}  )

         res.status(200).json({ msg : " Product update Successful" })
      }
      catch (error) {
         res.status(404).json({ error : error.message })
      }
}

//CREATE PRODUCT
const createProduct =  async (req, res) => {
   try{
       const {_id, role} = req.user
       if( role !== 'admin' ) {
          return  res.status(400).json({ error : "Not an admin" })
       }

       const { product_id, title, price, inStock, description, content, category,images} = req.body
       
       if( !product_id || !title || !price || !inStock || !description || !content || category === 'all' || images.length === 0 ) {
          return  res.status(404).json({ error : "Please add all the fields" })
       }

       const product = await Eproduct.findOne({product_id}) 
       console.log(product)
       if(product) {
         return  res.status(400).json({ error : "This product already exists" })
       }
      
        await Eproduct.create( { product_id, title: title.toLowerCase() , price, inStock, description, content, category,images } )

       res.status(200).json({ msg : " Product created successfully" })
    }
    catch (error) {
       res.status(404).json({ error : error.message })
    }
}

//DELETE PRODUCT
const deleteProduct =  async (req, res) => {
   try{
       const {_id, role} = req.user
       if( role !== 'admin' ) {
          return  res.status(400).json({ error : "Not an admin" })
       }

       const product = await Eproduct.findOneAndDelete({ _id: req.params.id }) 
       console.log(product)

       res.status(200).json({ msg : " Product deleted successfully" })
    }
    catch (error) {
       res.status(404).json({ error : error.message })
    }
}


module.exports = {
    getProduct,
    getSingleProduct,
    updateProduct,
    createProduct,
    deleteProduct
}