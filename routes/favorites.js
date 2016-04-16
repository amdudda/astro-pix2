var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');

// TODO this needs to be revamped to make use of MongoDB data

/* GET favorites listing. */
router.get('/', isLoggedIn, function (req, res, next) {

    // TODO if user logged in, send to favorites page, else redirect to login via Twitter.
    var myUser = req.user;
    //console.log(JSON.stringify(myUser));
    if (myUser.favorites === undefined) {
        myUser.favorites = [];
    }

    //console.log("attempting to render favorites");
    res.render('favorites', myUser);
});


router.post('/add', isLoggedIn, function (req, res, next) {

    // TODO if user logged in, add favorite & send to favorites page, else redirect to login via Twitter.
    /*console.log("at router.post(add)");
    console.log(req);
    console.log(JSON.stringify(req.user));*/
    console.log(req.body);

    var myUser = req.user;
    if (myUser.favorites === undefined) {
        myUser.favorites = [];
    }

    myUser.favorites.push(req.body);

    myUser.save(function(err){
        if (err) res.render('favorites', {error: err});
        res.redirect('/favorites');  //favorites page
    });


});

/*
 * Middleware function to verify user is logged in and authorized.
 * sends user back to homepage on failure.
 * redirect also cancels all route handling and just redirects to wherever specified.
 */
function isLoggedIn(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/auth/twitter');  // if not logged in, send user to Twitter signin.
}




module.exports = router;
