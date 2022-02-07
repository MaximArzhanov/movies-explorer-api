const router = require('express').Router();

const { getCurrentUser, updateUserInfo } = require('../controllers/users');

router.get('/users/me', getCurrentUser);

router.patch('/users/me', updateUserInfo);

module.exports = router;
