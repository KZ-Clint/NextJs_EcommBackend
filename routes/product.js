const express = require('express')
const router = express.Router()
const {
    getProduct,
    getSingleProduct,
    updateProduct,
    createProduct,
    deleteProduct
} = require('../controllers/productcontroller')




//GET ALL WORKOUTS
router.get('/', getProduct )

//GET A SINGLE WORKOUT
router.get('/:id', getSingleProduct )

const requireAuth = require('../middleware/auth')

router.use(requireAuth)

//UPDATE PRODUCT
router.put('/:id', updateProduct )

//CREATE PRODUCT
router.post('/', createProduct )

//CREATE PRODUCT
router.delete('/:id', deleteProduct )


module.exports = router