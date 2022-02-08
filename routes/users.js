const router = require('express').Router();
const { validateUpdateUserInfoRoute } = require('../validators/validatationJoi');
const { getCurrentUser, updateUserInfo } = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', validateUpdateUserInfoRoute(), updateUserInfo);

module.exports = router;
