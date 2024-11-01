var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const path = require('path');
var User = require('../../models/User.model');
var VerifyToken = require('./VerifyToken');
const funciones = require('../../funciones');
router.use(bodyParser.urlencoded({ extended: false }));
router.use(bodyParser.json());

router.post('/register', async function (req, res) {
	try {
		const existingUser = await User.findOne({ email: req.body.email });
		if (existingUser) {
			return res.status(400).send("El usuario ya existe.");
		}
		const user = await funciones.crearUsuario(req.body.name, req.body.email, req.body.password);
		
		// Generar y guardar el token en las cookies
		var token = jwt.sign({ id: user._id }, process.env.secret, {
			expiresIn: 86400 // expira en 24 horas
		});
		res.cookie('token', token, { sameSite: 'none', secure: true });
		res.status(200).send({ auth: true });

	} catch (error) {
		if (error.response && error.response.status === 400) {
			setErrorMessage('El usuario ya existe.');
		} else {
			setErrorMessage('Error en el registro.');
		}
		borrarAlerta();
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

router.get('/me2', VerifyToken, async function (req, res, next) {
	const user = await User.findById(req.userId, { password: 0 }); // projection
	if (!user) return res.status(404).send("No existe el usuario.");
	res.status(200).send(user);
});

module.exports = router;