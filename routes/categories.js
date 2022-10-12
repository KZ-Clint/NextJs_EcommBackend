const express = require('express')
const router = express.Router()
const {
    getCategories,
    createCategory,
    putCategory,
    deleteCategory
} = require('../controllers/categoriescontroller')

const requireAuth = require('../middleware/auth')

router.use(requireAuth)


//GET ALL CATEGORIES
router.get('/', getCategories )

//POST CATEGORY
router.post('/', createCategory )

//PUT CATEGORY
router.put('/:id', putCategory )

//POST CATEGORY
router.delete('/:id', deleteCategory )


module.exports = router