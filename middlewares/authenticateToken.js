import jwt from 'jsonwebtoken'

const SECRET_KEY = "PLAIN_TEXT_SECRET_KEY_123_*"; //just for development purposes

function authenticateToken(req, res, next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.sendStatus(401).json({ message: 'Token was not found in the request' });;

    jwt.verify(token, SECRET_KEY, (err, user) => {
        if (err) return res.sendStatus(403).json({ message: 'Token is not valid' });;

        req.user = user;
        next();
    });
}

export default authenticateToken;