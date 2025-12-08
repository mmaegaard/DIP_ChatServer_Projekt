// middleware/requireLogin

export function requireLogin(req, res, next) {
    if (req.session && req.session.user) {
        next();
    } else {
        res.status(401).send('Login required');
    }
}