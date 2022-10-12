const mongoose = require('mongoose')
const express = require('express')
require('dotenv/config')
const bodyParser = require('body-parser')
const cors = require('cors')
const userRoutes = require('./routes/user')
const productRoutes = require('./routes/product')
const orderRoutes = require('./routes/order')
const categoriesRoutes = require('./routes/categories')

const app = express()
app.use( bodyParser.json() )
app.use( express.json() )
app.use( cors( {
    origin:'*'
}) )

// app.get ( '/blog' , ( req, res) => {   
//     res.send('blog');
// } )

app.use( '/user', userRoutes  )

app.use( '/product', productRoutes )

app.use( '/order', orderRoutes )

app.use( '/categories', categoriesRoutes )



const dburi = process.env.DB_CONNECTION
mongoose.connect(dburi)
console.log('connected to db')

app.listen(process.env.PORT)





