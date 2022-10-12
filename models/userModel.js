const mongoose = require('mongoose')
const bcrypt = require('bcrypt')

const userSchema = mongoose.Schema( {
    name: {
        type : String,
        required : true,
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    password: {
        type: String,
        required: true,
        unique: true
    },
    role: {
        type: String,
        default: 'user'
    },
    root: {
        type: Boolean,
        default: false
    },
    avatar: {
        type: String,
        default: 'https://res.cloudinary.com/clintdb/image/upload/v1663105424/samples/people/smiling-man.jpg'
    }
}, { timestamps: true } )

//STATIC SIGNUP METHOD
userSchema.statics.signup = async function( name, email, password ) {

    const exists = await this.findOne( {email} )

    if (exists) {
        throw Error('Email already in use')
    }
    console.log('passed this finding emaail')
    const salt = await bcrypt.genSalt(10)
    const hash = await bcrypt.hash( password, salt ) 
   
    const user = await this.create({ name, email, password: hash })

    return user

}

//STATIC LOGIN METHOD
userSchema.statics.login = async function (email, password) {

    if (!email || !password) {
       throw Error('All fields must be filled')
    }

    const user = await this.findOne( {email} )

    if (!user) {
        throw Error('incorrect email')
    }

    const match = await bcrypt.compare(password, user.password)

    if(!match) {
        throw Error('Incorrect password')
    }

    return user
}

//STATIC LOGIN METHOD
userSchema.statics.updates = async function (_id, password,name ) {

    const salt = await bcrypt.genSalt(10)
    const passwordHash = await bcrypt.hash(password, salt)  
    const user = await this.findOneAndUpdate({ _id: _id }, {password: passwordHash, name:name } )

    return user
}

module.exports = mongoose.model('Euser', userSchema )