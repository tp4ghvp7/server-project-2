
const express = require('express')
const md5 = require('blueimp-md5')

const UserModel = require('../db/models/UserModel')
const CategoryModel = require('../db/models/CategoryModel')
const ProductModel = require('../db/models/ProductModel')
const RoleModel = require('../db/models/RoleModel')


const router = express.Router()

const filter = {password: 0, __v: 0}

router.get('/', function(req, res, next) {
  res.render('index', { title: 'Garruk'});
});

router.post('/login', (req, res) => {
  const {username, password} = req.body
  UserModel.findOne({username, password: md5(password)})
    .then(user => {
      if (user) { 
        res.cookie('userid', user._id, {maxAge: 1000 * 60 * 60 * 24})
        if (user.role_id) {
          RoleModel.findOne({_id: user.role_id})
            .then(role => {
              user._doc.role = role
              console.log('role user', user)
              res.send({status: 0, data: user})
            })
        } else {
          user._doc.role = {menus: []}
          res.send({status: 0, data: user})
        }

      } else {
        res.send({status: 1, msg: 'username or password not correct!'})
      }
    })
    .catch(error => {
      console.error('login error', error)
      res.send({status: 1, msg: 'login error, please try it again'})
    })
})

router.post('/manage/user/add', (req, res) => {
  const {username, password} = req.body
  UserModel.findOne({username})
    .then(user => {
      if (user) {
        res.send({status: 1, msg: 'already have this user'})
        return new Promise(() => {
        })
      } else {
        return UserModel.create({...req.body, password: md5(password || 'atguigu')})
      }
    })
    .then(user => {
      res.send({status: 0, data: user})
    })
    .catch(error => {
      console.error('register error', error)
      res.send({status: 1, msg: 'register error please try again'})
    })
})


router.post('/manage/user/update', (req, res) => {
  const user = req.body
  UserModel.findOneAndUpdate({_id: user._id}, user)
    .then(oldUser => {
      const data = Object.assign(oldUser, user)
      res.send({status: 0, data})
    })
    .catch(error => {
      console.error('update faile', error)
      res.send({status: 1, msg: 'update faile'})
    })
})

router.post('/manage/user/delete', (req, res) => {
  const {userId} = req.body
  UserModel.deleteOne({_id: userId})
    .then((doc) => {
      res.send({status: 0})
    })
})

router.get('/manage/user/list', (req, res) => {
  UserModel.find({username: {'$ne': 'admin'}})
    .then(users => {
      RoleModel.find().then(roles => {
        res.send({status: 0, data: {users, roles}})
      })
    })
    .catch(error => {
      console.error('get user list faile', error)
      res.send({status: 1, msg: 'get user list faile'})
    })
})

router.post('/manage/category/add', (req, res) => {
  const {categoryName, parentId} = req.body
  CategoryModel.create({name: categoryName, parentId: parentId || '0'})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('add category falie', error)
      res.send({status: 1, msg: 'add category falie'})
    })
})

router.get('/manage/category/list', (req, res) => {
  const parentId = req.query.parentId || '0'
  CategoryModel.find({parentId})
    .then(categorys => {
      res.send({status: 0, data: categorys})
    })
    .catch(error => {
      console.error('get category list faile', error)
      res.send({status: 1, msg: 'get category list faile'})
    })
})

router.post('/manage/category/update', (req, res) => {
  const {categoryId, categoryName} = req.body
  CategoryModel.findOneAndUpdate({_id: categoryId}, {name: categoryName})
    .then(oldCategory => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('update category name faile', error)
      res.send({status: 1, msg: 'update category name faile'})
    })
})

router.get('/manage/category/info', (req, res) => {
  const categoryId = req.query.categoryId
  CategoryModel.findOne({_id: categoryId})
    .then(category => {
      res.send({status: 0, data: category})
    })
    .catch(error => {
      console.error('get category information faile', error)
      res.send({status: 1, msg: 'get category information faile'})
    })
})


router.post('/manage/product/add', (req, res) => {
  const product = req.body
  ProductModel.create(product)
    .then(product => {
      res.send({status: 0, data: product})
    })
    .catch(error => {
      console.error('add product faile', error)
      res.send({status: 1, msg: 'add product faile'})
    })
})

router.get('/manage/product/list', (req, res) => {
  const {pageNum, pageSize} = req.query
  ProductModel.find({})
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('get product list faile', error)
      res.send({status: 1, msg: 'get product list faile'})
    })
})

router.get('/manage/product/search', (req, res) => {
  const {pageNum, pageSize, searchName, productName, productDesc} = req.query
  let contition = {}
  if (productName) {
    contition = {name: new RegExp(`^.*${productName}.*$`)}
  } else if (productDesc) {
    contition = {desc: new RegExp(`^.*${productDesc}.*$`)}
  }
  ProductModel.find(contition)
    .then(products => {
      res.send({status: 0, data: pageFilter(products, pageNum, pageSize)})
    })
    .catch(error => {
      console.error('search product faile', error)
      res.send({status: 1, msg: 'search product faile'})
    })
})

router.post('/manage/product/update', (req, res) => {
  const product = req.body
  ProductModel.findOneAndUpdate({_id: product._id}, product)
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('update product faile', error)
      res.send({status: 1, msg: 'update product faile'})
    })
})

router.post('/manage/product/updateStatus', (req, res) => {
  const {productId, status} = req.body
  ProductModel.findOneAndUpdate({_id: productId}, {status})
    .then(oldProduct => {
      res.send({status: 0})
    })
    .catch(error => {
      console.error('update product condition faile', error)
      res.send({status: 1, msg: 'update product condition faile'})
    })
})


router.post('/manage/role/add', (req, res) => {
  const {roleName} = req.body
  RoleModel.create({name: roleName})
    .then(role => {
      res.send({status: 0, data: role})
    })
    .catch(error => {
      console.error('add role faile', error)
      res.send({status: 1, msg: 'add role faile'})
    })
})

router.get('/manage/role/list', (req, res) => {
  RoleModel.find()
    .then(roles => {
      res.send({status: 0, data: roles})
    })
    .catch(error => {
      console.error('get role list faile', error)
      res.send({status: 1, msg: 'get role list faile'})
    })
})


router.post('/manage/role/update', (req, res) => {
  const role = req.body
  role.auth_time = Date.now()
  RoleModel.findOneAndUpdate({_id: role._id}, role)
    .then(oldRole => {
      res.send({status: 0, data: {...oldRole._doc, ...role}})
    })
    .catch(error => {
      console.error('update role faile', error)
      res.send({status: 1, msg: 'update role faile'})
    })
})

function pageFilter(arr, pageNum, pageSize) {
  pageNum = pageNum * 1
  pageSize = pageSize * 1
  const total = arr.length
  const pages = Math.floor((total + pageSize - 1) / pageSize)
  const start = pageSize * (pageNum - 1)
  const end = start + pageSize <= total ? start + pageSize : total
  const list = []
  for (var i = start; i < end; i++) {
    list.push(arr[i])
  }

  return {
    pageNum,
    total,
    pages,
    pageSize,
    list
  }
}

require('./file-upload')(router)

module.exports = router