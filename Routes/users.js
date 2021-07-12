import express from 'express';
import multer from 'multer';
import users from '../Controllers/users';

// auth middleware for user
import isLoggedInUser from '../Middlewares/loggedIn';

const storage = multer.memoryStorage();
const upload = multer({
	storage,
});
const userRouter = express.Router();

userRouter.get('/', users.getusers);
userRouter.post('/getbyid', isLoggedInUser.isLoggedIn, users.getuserById);
userRouter.patch('/edit/:id', isLoggedInUser.isLoggedIn, users.editProfile);
userRouter.post('/addreview', isLoggedInUser.isLoggedIn, users.addReview);
userRouter.post('/getreview/:id', users.getReviewById);
userRouter.post('/adduserimage', isLoggedInUser.isLoggedIn, upload.single('imageUrl'), users.adduserImage);

export default userRouter;
