const Euser = require('../models/userModel')
const jwt = require('jsonwebtoken')

const createAccessToken = (_id) => {
    return jwt.sign({_id}, process.env.ACCESS_TOKEN_SECRET, { expiresIn : '1d' } )
  }
  const createRefreshToken = (_id) => {
    return jwt.sign({_id}, process.env.REFRESH_TOKEN_SECRET, { expiresIn : '7d' } )
  }
  

//SIGNUP USER
const signupUser = async (req,res) => {
    const { name, email, password } = req.body

    try {
        const user = await Euser.signup( name, email, password  )

        //CREATE TOKEN
        const access_token = createAccessToken(user._id)

        res.status(200).json({email, access_token, user: {
          name:user.name,
          email:user.email,
          role: user.role,
          avatar: user.avatar,
          root: user.root
        } })
        
    } catch (err) {
        res.status(400).json({error : err.message})
    }
    console.log("USER HAS SIGNED UP")
}

//LOGIN USER
const loginUser = async ( req, res ) => {
    const { email, password} = req.body
  
    try{
      const user = await Euser.login( email, password )

      //CREATE TOKEN
      const access_token = createAccessToken(user._id)
      const refresh_token = createRefreshToken(user._id)

      res.status(200).json({email, refresh_token, access_token, user: {
        name:user.name,
        email:user.email,
        role: user.role,
        avatar: user.avatar,
        root: user.root
      } })
      
    }catch (error) {
      res.status(400).json({error: error.message })
    }
      console.log("USER HAS LOGGED IN")
   }

const updateUsers = async ( req, res ) => {

  const {_id} = req.user
 
  const { name, password} = req.body
  console.log(req.body)

  const user = await Euser.updates( _id, password, name )
  
  res.status(200).json({ name } )

  console.log("USER HAS UPDATED")

   }

   const updateAvatar = async ( req, res ) => {

    const {_id} = req.user

    const updateA = await Euser.findOneAndUpdate({ _id : _id }, {
        avatar: req.body.avatar,
      }, {new:true}
    )
  
       console.log({updateA})
       if(!updateA) {
        return  res.status(404).json({ error : "No such Avatar" })
       }  
  
       res.status(200).json(updateA)
  
       console.log('Avatar Updated!!!!')
  
     }

  const getUsers = async (req,res) => {
  
      try {
          
        const {_id, role} = req.user
        if( role !== 'admin' ) {
            return  res.status(400).json({error : 'role is not admin'})
        }

        const users = await Euser.find().select('-password')
        res.json({users})

      } catch (err) {
          res.status(400).json({error : err.message})
      }
      console.log(" Gotten User ")
  }

  const updateUserRole = async ( req, res ) => {
     try {
      const {_id, role,root} = req.user
      if( role !== 'admin' || !root ) {
         return res.status(400).json({error : "Authentication is not valid"})
      }
      
      const updateUr = await Euser.findOneAndUpdate({ _id : req.params.id }, {
        role: req.body.role,
      }, {new:true}
     )
     res.status(200).json({ msg: 'Update Success' }) 
     console.log('Admin Users Updated!!!!')

     }
     catch (error) {
      res.status(404).json({ error : error.message })
     }
  
     }

     const deleteUserByAdmin  = async ( req, res ) => {
      try {
       const {_id, role,root} = req.user
       if( role !== 'admin' || !root ) {
          return res.status(400).json({error : "Authentication is not valid"})
       }
       const {id} = req.params
       
      await Euser.findByIdAndDelete(id)
      res.status(200).json({ msg: 'delete Successful' }) 
      console.log('Admin has deleted User!!!!')
 
      }
      catch (error) {
       res.status(404).json({ error : error.message })
      }
   
      }

   module.exports = { signupUser, updateUsers, loginUser, updateAvatar, getUsers, updateUserRole, deleteUserByAdmin }