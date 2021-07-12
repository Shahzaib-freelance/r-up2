import express from 'express';
import multer from 'multer';
import userSignUp from '../Controllers/userSignup';
import userValidator from '../validations/user';

const storage = multer.memoryStorage();
const upload = multer({
	storage,
});
const signUpRouter = express.Router();

signUpRouter.post(
	'/',
	upload.single('imageUrl'),
	userValidator.userSignup,
	userSignUp.userSignUp,
);

signUpRouter.post(
	'/verifyotp',
	userSignUp.verifyOTP,
);

signUpRouter.post(
	'/sendotp',
	userSignUp.sendOTP,
);

signUpRouter.post(
	'/completeprofile/:id',
	userSignUp.completeProfile,
);
export default signUpRouter;
