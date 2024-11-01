var mongoose = require("mongoose");
var User = require('./models/User.model.js');
const bcrypt = require('bcryptjs');

async function crearUsuario(name, email, password) {
    // Crear nuevo usuario si no existe
		var hashedPassword = bcrypt.hashSync(password, 8);
		const user = await User.create({
			name: name,
			email: email,
			password: hashedPassword
		});
        return await user.save();
}
module.exports = {
    crearUsuario,
};