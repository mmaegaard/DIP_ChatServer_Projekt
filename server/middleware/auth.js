// Authorization + Session

export function authorize(levelRequired) {
    return (req, res, next) => {
        if (req.session && req.session.user && req.session.user.accessLevel >= levelRequired) {
            next(); // Bruger har adgang
        } else {
            res.status(403).send('Access denied');
        }
    };
}