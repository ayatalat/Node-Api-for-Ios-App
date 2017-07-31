var express = require('express');
var router = express.Router();
var mongoose = require('mongoose');
var apn = require('apn');

var User = require('../models/user');


router.get('/', function (req, res, next) {
	res.send('user route');
});

router.get('/setup', function (req, res, next) {
	var testuser = new User({
		name: 'testuser',
		password: 'iti',
		admin: true
	});
	testuser.save(function (err) {
		if (err) throw err;

		console.log('User saved successfully');
		res.json({ success: true });
	});
})


router.post('/register', function (req, res, next) {
	console.log("token", req.body.deviceToken)

	let provider = new apn.Provider({
		token: {
			key: "key.pem",
			teamId: "com.pushbots.logapp",
			keyId:"" // is missing 
		},
		cert: "cert.pem",
		
		production: false
	});

	var deviceToken = req.body.deviceToken;
	let notification = new apn.Notification();
	notification.alert = "Hello, world!";
	notification.badge = 1;
	notification.payload = { 'message': 'hi there' };
	provider.send(notification, deviceToken).then((response) => {
			if (response.sent) {
			console.log("sended success", response.sent);
			res.json({ success: true });

		}
		else if (response.failed) {
			console.log("failed", response.failed)
			if (response.failed.status == 410) {
				console.log("unregister")
				res.json({ failed: true, status: 410 });
			} else {
				res.json({ failed: true });
				console.log(response.failed)
			}
		} else {
			res.json({ unknow: true })
		}
	});

	

})
module.exports = router