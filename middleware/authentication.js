const jwt = require('jsonwebtoken');

const STATIC_TOKEN_SECRET = 'my_static_secret'; // Static secret key for signing the token

// Generate a static token with a predefined payload
const staticTokenPayload = {
    username: 'static_user',
    role: 'admin' // Assuming some role for the user
};

// Set the expiration time to one year (in seconds)
const expiresInOneYear = 365 * 24 * 60 * 60; // 1 year in seconds

const staticToken = jwt.sign(staticTokenPayload, STATIC_TOKEN_SECRET, { expiresIn: expiresInOneYear });

console.log("staticToken", staticToken);

// Middleware to authenticate requests using the static token
function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null || token !== staticToken) return res.sendStatus(401);

    jwt.verify(token, STATIC_TOKEN_SECRET, (err, user) => {
        if (err) return res.sendStatus(403);
        req.user = user;
        next();
    });
}

module.exports = authenticateToken;