const express = require('express')
const router = express.Router()
const {
    createOrder,
    getOrders,
    updateOrders,
    adminUpdateOrders
} = require('../controllers/ordercontroller')

// REQUIRE AUTH FOR ALL ORDER ROUTES
const requireAuth = require('../middleware/auth')

router.use(requireAuth)

//POST A NEW ORDER
router.post('/', createOrder )

//GET ORDER
router.get('/', getOrders )

//UPDATE ORDER
router.patch('/payment/:id', updateOrders )

//UPDATE ORDER DELIVERED STATUS
router.patch('/payment/delivered/:id', adminUpdateOrders )

module.exports = router