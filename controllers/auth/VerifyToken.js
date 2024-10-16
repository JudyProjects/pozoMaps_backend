var jwt = require('jsonwebtoken');

function verifyToken(req, res, next) {
	var token = req.cookies.token;
	if (!token)
		// Si no tiene token en cookies: redirecciona a LOGIN
		return res.status(403).redirect('/api/auth/login');
	jwt.verify(token, process.env.secret, function (err, decoded) {
		if (err)
			// Si hay error: redirecciona a LOGIN
			return res.status(500).redirect('/api/auth/login');
		req.userId = decoded.id;
		next();
	});
}
module.exports = verifyToken;