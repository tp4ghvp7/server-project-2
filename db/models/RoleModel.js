// 1.Introducing Mongoose
const mongoose = require('mongoose')

// 2. definition dictionary
const roleSchema = new mongoose.Schema({
  name: {type: String, required: true}, 
  auth_name: String, 
  auth_time: Number, 
  create_time: {type: Number, default: Date.now}, 
  menus: Array 
})

// 3. definition Model
const RoleModel = mongoose.model('roles', roleSchema)

// 4. export Model
module.exports = RoleModel
