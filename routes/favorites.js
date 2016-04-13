var express = require('express');
var router = express.Router();

/* GET favorites listing. */
router.get('/', function(req, res, next) {

  //var fav_list = {favorites : [ {'url':'a.com', 'title':'boop', 'date':'123'} ] };

  if (req.session.fav_list === undefined) {
    req.session.fav_list = { favorites : [] }
  }

  console.log(req.session.fav_list);
  res.render('favorites', req.session.fav_list);
});


router.post('/add', function(req, res, next){

  console.log("at router.post(add)");
  console.log(req);
  console.log(req.body);

  if(req.session.fav_list === undefined) {
    req.session.fav_list = { favorites : [] }
  }

  req.session.fav_list.favorites.push(req.body);

  res.redirect('/favorites');  //favorites page

});

module.exports = router;
