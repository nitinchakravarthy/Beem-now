const express = require('express');
const router = express.Router();
const {check, validationResult} = require('express-validator');
const multer = require("multer");
const upload= multer({ dest: 'uploads/' })

// require controllers
const userController = require('../controllers/userController');

/* GET users listing. */
router.get('/', function(req, res, next) {
  console.log(req.session);
  res.send('User Home');
});

router.post('/login', [check('email','Email is not valid').not().isEmpty().isEmail().normalizeEmail({ remove_dots: false }),
                       check('password', 'Password must be at least 4 characters long').not().isEmpty().isLength({min: 4})],
                      userController.loginHandler)

router.post('/signup', [check('first_name','Name should have more than 3 characters').not().isEmpty().isLength({min: 3}),
                        check('last_name','Name should have more than 3 characters').not().isEmpty().isLength({min: 3}),
                       check('email','Email is not valid').not().isEmpty().isEmail().normalizeEmail({ remove_dots: false }),
                       check('password', 'Password must be at least 4 characters long').not().isEmpty().isLength({min: 4}),
                       check('gender','Gender cannot be empty').not().isEmpty()],
                      userController.signUpHandler);

router.get('/confirmation', [check('token', 'token cannot be empty').not().isEmpty()],
                            userController.confirmationPost);
router.post('/resendToken', [check('email','Email is not valid').not().isEmpty().isEmail().normalizeEmail({ remove_dots: false })],
                            userController.resendToken);

router.post('/requestPasswordReset',[check('email','Email is not valid').not().isEmpty().isEmail().normalizeEmail({ remove_dots: false })],
                            userController.resetPasswordStart);

// router.get('/setNewPassword',[check('token', 'token cannot be empty').not().isEmpty()],
//                             userController.SendPasswordResetPage);

router.post('/resetPassword',[check('token', 'token cannot be empty').not().isEmpty(),
                            check('newPassword', 'Password must be at least 4 characters long').not().isEmpty().isLength({min: 4}),
                            check('newPasswordConf', 'Password must be at least 4 characters long').not().isEmpty().isLength({min: 4})],
                            userController.resetPasswordEnd);

router.get('/profile', [check('uid','uid cannot be empty').not().isEmpty()],
                            userController.sendProfile);

router.post('/uploadAvatar',[check('uid','uid cannot be empty').not().isEmpty()],upload.single('image'),userController.uploadAvatar);

router.get('/getAvatar',[check('uid','uid cannot be empty').not().isEmpty()], userController.getAvatarImage);

router.post('/editProfile',[check('uid','uid cannot be empty').not().isEmpty()], userController.editProfile);


// need a method to update payment options

router.get('/logout',[check('uid','uid cannot be empty').not().isEmpty()],userController.logout);

module.exports = router;
