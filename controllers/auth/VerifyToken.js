var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
	var token = req.cookies.token;
	if (!token) {
		return res.status(401).json({ auth: false, message: 'No se proporcionó un token' });
	}
	
	jwt.verify(token, process.env.secret, function (err, decoded) {
		if (err) {
			return res.status(401).json({ auth: false, message: 'Token no válido' });
		}
		
		req.userId = decoded.id;
		next();
	});
}

module.exports = verifyToken;
