var express = require('express');
var router = express.Router();
var passport = require('passport');
var User = require('../models/user');
var bodyParser = require('body-parser');

/* GET favorites listing. */
router.get('/', isLoggedIn, function (req, res, next) {

    // if user logged in, send to favorites page, else redirect to login via Twitter.
    var myUser = req.user;
    //console.log(JSON.stringify(myUser));
    if (myUser.favorites === undefined) {
        myUser.favorites = [];
    }

    //console.log("attempting to render favorites");
    res.render('favorites', myUser);
});


router.post('/add', isLoggedIn, function (req, res, next) {

    // if user logged in, add favorite & send to favorites page, else redirect to login via Twitter.
    /*console.log("at router.post(add)");
    console.log(req);
    console.log(JSON.stringify(req.user));*/
    console.log(req.body);

    var myUser = req.user;
    if (myUser.favorites === undefined) {
        myUser.favorites = [];
    }
    var found = false;
    for (var i = 0; i<myUser.favorites.length; i++) {
        var curFave = myUser.favorites[i];
        if (req.body.url == curFave.url) {
            found = true;
            break;  // we found a match - break out of loop.
        }
    }

    if (!found)
        myUser.favorites.push(req.body);  // only add favorite if it isn't already in the list

    myUser.save(function(err){
        if (err) res.render('favorites', {error: err, msg: 'Error saving favorite'});
        res.redirect('/favorites');  //favorites page
    });


});

router.post('/delfave', isLoggedIn, function(req,res,next) {
    // TODO this deletes a favorite from a user's list of faves based on the Url passed to here
    console.log("deleting... " + req.body.favUrl);
    var myUser = req.user;
    //var userFavs = myUser.favorites;
    var favUrl = req.body.favUrl;

    // find the favorite to be delete it, and remove it from the array of faves.
    for (var f = 0; f<myUser.favorites.length; f++) {
        console.log(myUser.favorites[f].url);
        if (myUser.favorites[f].url == favUrl) {
            myUser.favorites.splice(f, 1);
            break;
        }

    }

    // save the changed data.
    myUser.save(function (err) {
        if (err) res.render('favorites', {error: err, msg: "Error deleting favorite."});
        res.redirect('/favorites');
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


/* work with route parameters to provide task objects */
router.param("user_id", function(req, res, next, userId) {

    console.log("params being extracted from URL for " + userId);

    User.findOne({ "twitter.username" : userId}, function(err,user) {
        if (err) {
            res.render("favorites", { msg: "unable to find user", "error": error});
        }
        req.user = user;
        return next();
    });
});

// show a user's favorites by POSTing to /favorites/user_id
// set completed value associated with task id to true
router.get("/:user_id", function(req, res, next) {

    User.findById(req.user_id,
        function(error, user) {
            if (error) {
              //This will happen if DB error, for example, connection lost
              return next(err);
            }
            if (!user) {
              //This is where you want to handle user not found
              return res.render("favorites", { msg: "unable to find user", "error": error});
            }
            //console.log(user._id);
            user.guestview = true;    //To be implemented?
            return res.render("favorites", user);
        });
});


module.exports = router;
