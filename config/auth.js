// this stores authentication data for my application

module.exports = {
	'twitterAuth' : {
		'consumerKey': process.env.PTWIT_CONSUMER_KEY,
		'consumerSecret': process.env.PTWIT_CONSUMER_SECRET,
		'callbackURL' : 'http://127.0.0.1:3000/auth/twitter/callback'
	}

};