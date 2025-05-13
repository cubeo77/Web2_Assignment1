
const {database} = require('../database.js');

function checkAuthorization(req, res, next) {
    if (req.session.type === 'researcher') {
      console.log('User is a researcher:', req.session.user);
      res.redirect('/user/researcher');
    }
    else if (req.session.type === 'explorer') {
      console.log('User is an explorer:', req.session.user);
      res.redirect('/user/explorer');
    } else {
      console.log('invalid user type:', req.session.type);
      res.redirect('/');
    }
  }
  
  // These pairs of functions are used to check if the user is authorized as a researcher or explorer.
  function isAdmin(req, res, next) {
    if (req.session.type === 'admin') {
      console.log('User is an admin:', req.session.user);
      next(); 
    } else {
      console.log('invalid user type:', req.session.type);
      res.status(403).send("Not authorized");

      res.redirect('/login');
    }
  }



  module.exports = {
    checkAuthorization,
    isAdmin
  };