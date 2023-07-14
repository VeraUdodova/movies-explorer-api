const router = require('express').Router();
const { updateUser, getMe } = require('../controllers/users');
const { validateUpdateUserBody } = require('../validators/users');

router.get('/me', getMe);
router.patch('/me', validateUpdateUserBody, updateUser);

module.exports = router;
