const router = require('express').Router();
const { validateSignupRoute, validateSigninRoute } = require('../validators/validatation-joi');
const { createUser, login } = require('../controllers/users');

/** Роут регистрации пользователя */
router.post('/signup', validateSignupRoute, createUser);

/** Роут авторизации пользователя */
router.post('/signin', validateSigninRoute, login);

module.exports = router;
