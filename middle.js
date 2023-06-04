const jwt = require("jsonwebtoken");
const secret_key = 'secret_key';

const authenticateUser = (req, res, next) => {
    
    try {
        const token = req.headers['authorization'];
        if (token == null) {
            //console.log('here')
            return res.status(401).json({ message: "Unauthorized" });
        }

        jwt.verify(token, secret_key, (err, user) => {
            if (err) {
                return res.status(403).json({ message: "Invalid token" });
            }
            req.user = user;
            next();
        })
    }
    catch (e) {
        console.log(e);
    }
}

module.exports = { authenticateUser }