const express = require('express')
const { signupUser, updateUsers, loginUser, updateAvatar, getUsers, updateUserRole, deleteUserByAdmin } = require('../controllers/usercontroller')

const router = express.Router()

//SIGNUP 
router.post( '/signup', signupUser )

//LOGIN
router.post( '/login', loginUser )


// REQUIRE AUTH FOR ALL WORKOUT ROUTES
const requireAuth = require('../middleware/auth')

router.use(requireAuth)

//UPDATE USER
router.patch( '/', updateUsers )

//UPDATE AVATAR
router.patch( '/avatar', updateAvatar )

//GET USERS
router.get( '/users', getUsers )

//UPDATE ADMIN USERS
router.patch( '/users/adminusers/:id', updateUserRole )

//DELETE USER BY ADMIN
router.delete( '/users/adminusers/delete/:id', deleteUserByAdmin)

module.exports = router