// 1.Introducing Mongoose
const mongoose = require('mongoose')

// 2. definition dictionary
const productSchema = new mongoose.Schema({
  categoryId: {type: String, required: true}, 
  pCategoryId: {type: String, required: true}, 
  name: {type: String, required: true}, 
  price: {type: Number, required: true}, 
  desc: {type: String},
  status: {type: Number, default: 1}, 
  imgs: {type: Array, default: []}, 
  detail: {type: String}
})


// 3. definition Model
const ProductModel = mongoose.model('products', productSchema)

// 4. export Model
module.exports = ProductModel