var express = require('express');
var router = express.Router();

// const UserModel = require('../db/models/UserModel')
// const CategoryModel = require('../db/models/CategoryModel')
// const ProductModel = require('../db/models/ProductModel')
// const RoleModel = require('../db/models/RoleModel')

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Garruk' });
});

module.exports = router;
