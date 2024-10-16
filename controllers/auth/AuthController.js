var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const path = require('path');
var User = require('../../models/User.model');
var VerifyToken = require('./VerifyToken');
const funciones = require('../../resources/js/funciones.js');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', async function (req, res) {
	var hashedPassword = bcrypt.hashSync(req.body.password, 8);
	const user = await User.create({
		name: req.body.name,
		email: req.body.email,
		password: hashedPassword
	});
	if (user.email == req.body.email) {
		var token = jwt.sign({ id: user._id }, process.env.secret, {
			expiresIn: 86400 // expira en 24 hours
		});
		res.status(200).send({ auth: true, token: token });
	} else {
		return res.status(500).send("Error");
	}
});

router.post('/login', async function (req, res) {
	const user = await User.findOne({ email: req.body.email });
	if (!user) return res.status(404).send('No existe usuario.');
	var passwordIsValid = bcrypt.compareSync(req.body.password, user.password);
	if (!passwordIsValid) return res.status(401).send({ auth: false, token: null });
	var token = jwt.sign({ id: user._id }, process.env.secret, {
		expiresIn: 86400 // expira en 24 hours
	});
	res.cookie('token', token, { sameSite: 'none', secure: true });
	res.status(200).send({ auth: true });
});

router.get('/login', function (req, res) {
	/* var token = req.cookies.token;
	if (token) {
		return res.status(200).redirect('/api/auth/lobby');
	} */
	return res.status(200).sendFile(path.join(__dirname, '../../views/login.html'));
});

router.get('/lobby', VerifyToken, function (req, res) {
	res.status(200).sendFile(path.join(__dirname, '../../views/lobby.html'));
});

router.get('/me2', VerifyToken, async function (req, res, next) {
	const user = await User.findById(req.userId, { password: 0 }); // projection
	if (!user) return res.status(404).send("No existe el usuario.");
	res.status(200).send(user);
});

module.exports = router;