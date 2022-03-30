// 1.Introducing Mongoose
const mongoose = require('mongoose')
const md5 = require('blueimp-md5')

// 2. definition dictionary

const userSchema = new mongoose.Schema({
  username: {type: String, required: true}, // 用户名
  password: {type: String, required: true}, // 密码
  phone: String,
  email: String,
  create_time: {type: Number, default: Date.now},
  role_id: String
})

// 3. definition Model
const UserModel = mongoose.model('users', userSchema)

// Super admin: admin/admin
UserModel.findOne({username: 'admin'}).then(user => {
  if(!user) {
    UserModel.create({username: 'admin', password: md5('admin')})
            .then(user => {
              console.log('initialize user: Username: admin , Password: admin')
            })
  }
})

// 4. exprot Model
module.exports = UserModel