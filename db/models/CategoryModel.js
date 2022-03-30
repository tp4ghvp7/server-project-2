// 1.Introducing Mongoose
const mongoose = require('mongoose')

// 2. definition dictionary
const categorySchema = new mongoose.Schema({
  name: {type: String, required: true},
  parentId: {type: String, required: true, default: '0'}
})

// 3. definition Model
const CategoryModel = mongoose.model('categorys', categorySchema)

// 4. export Model
module.exports = CategoryModel