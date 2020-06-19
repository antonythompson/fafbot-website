var express = require('express');
var router = express.Router();
const joinRoutes = require('./joins')
//home
router.get('/', function(req, res, next) {
  res.render('index', { title: 'FAF Bot' });
});


module.exports = function(app){
  app.use('/joins', joinRoutes);
  return router;
};
