function authenticated(req, res, next) {
    if (req.session.user) {
        console.log('User is authenticated:', req.session.user);
        next();
    } else {
        console.log('User is not authenticated');
        res.redirect('/');
    }
}

module.exports = {authenticated};