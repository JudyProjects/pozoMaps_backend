var express = require('express');
var router = express.Router();
var bodyParser = require('body-parser');
var jwt = require('jsonwebtoken');
var bcrypt = require('bcryptjs');
const path = require('path');
var User = require('../../models/User.model');
var VerifyToken = require('./VerifyToken');
const funciones = require('../../funciones');
const verifyToken = require('./VerifyToken');
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

router.get('/me', VerifyToken, async function (req, res){
	try {
        const user = await User.findById(req.userId, { password: 0 }); // Excluye la contraseña
        if (!user) return res.status(404).send("Usuario no encontrado.");

        res.status(200).send({ name: user.name });
    } catch (error) {
        res.status(500).send("Hubo un problema obteniendo la información del usuario.");
    }
});

router.post('/logout', (req, res) => {
    res.clearCookie('token', { sameSite: 'none', secure: true });
    res.status(200).send({ message: 'Cierre de sesión exitoso' });
});

router.get('/perfil', verifyToken, async (req, res) => {
	try {
        const user = await User.findById(req.userId, { password: 0 }); // Excluye la contraseña
        if (!user) return res.status(404).send("Usuario no encontrado.");

        res.status(200).send(user);
    } catch (error) {
        res.status(500).send("Hubo un problema obteniendo la información del usuario.");
    }
});

router.put('/perfil', verifyToken, async (req, res) => {
	try {
        const updatedUser = await User.findByIdAndUpdate(req.userId, req.body, { new: true });
        res.status(200).send(updatedUser);
    } catch (error) {
        res.status(500).send("Hubo un problema actualizando el perfil.");
    }
});

module.exports = router;