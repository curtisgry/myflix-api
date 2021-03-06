const jwtSecret = process.env.JWT_SECRET;

const jwt = require('jsonwebtoken');
const passport = require('passport');

require('./passport');

const generateJWTToken = (user) =>
        jwt.sign(user, jwtSecret, {
                subject: user.Username,
                expiresIn: '7d',
                algorithm: 'HS256',
        });

// Post login
module.exports = (router) => {
        router.post('/login', (req, res) => {
                passport.authenticate('local', { session: false }, (error, user, info) => {
                        if (error || !user) {
                                return res.status(400).json({
                                        message: 'Something is not right',
                                        user,
                                });
                        }
                        req.login(user, { session: false }, (error) => {
                                if (error) {
                                        res.send(error);
                                }
                                const token = generateJWTToken(user.toJSON());
                                return res.json({ user, token });
                        });
                })(req, res);
        });
};
