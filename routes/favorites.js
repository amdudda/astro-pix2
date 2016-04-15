var express = require('express');
var router = express.Router();
var User = require('../models.user');

// TODO this needs to be revamped to make use of MongoDB data

/* GET favorites listing. */
router.get('/', isLoggedIn, function (req, res, next) {

    // TODO if user logged in, send to favorites page, else redirect to login via Twitter.
    var myUser = req.user;
    console.log(myUser);
    if (myUser.favorites === undefined) {
        myUser.favorites = [];
    }

    console.log(myUser.favorites);
    res.render('favorites', myUser.favorites);
});


router.post('/add', isLoggedIn, function (req, res, next) {

    // TODO if user logged in, add & send to favorites page, else redirect to login via Twitter.
    console.log("at router.post(add)");
    console.log(req);
    console.log(req.user);
    console.log(req.body);

    var myUser = req.user;
    if (myUser.favorites === undefined) {
        myUser.favorites = [];
    }

    myUser.favorites.push(req.body);

    res.redirect('/favorites');  //favorites page

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


/* GET logout */
router.get('/logout', function (req, res, next) {
    req.logout();  // passport middleware adds this to req.
    res.redirect('/');  // then send user back to homepage.
});

router.get('/auth/twitter', passport.authenticate('twitter'));

router.get('/auth/twitter/callback', passport.authenticate('twitter', {
    successRedirect: '/favorites',
    failureRedirect: '/'
}));

module.exports = router;
