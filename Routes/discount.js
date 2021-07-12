import express from 'express';
import multer from 'multer';
import discounts from '../Controllers/discount';

// auth middlewares for admin
// import isAdminMiddleware from '../Middlewares/isManager';
// auth middleware for user
import isLoggedInUser from '../Middlewares/loggedIn';

const storage = multer.memoryStorage();
const upload = multer({
	storage,
});
const discountRouter = express.Router();

discountRouter.post(
	'/create',
	isLoggedInUser.isLoggedIn,  upload.single('imageUrl'),
	discounts.createOffer,
);

discountRouter.get('/', isLoggedInUser.isLoggedIn, discounts.getOffers);

discountRouter.get('/getrestaurantoffers/:id', isLoggedInUser.isLoggedIn, discounts.getRestaurantOffers);

discountRouter.get('/getsingleoffer/:id', isLoggedInUser.isLoggedIn, discounts.getSingleOffer);

discountRouter.post('/filteroffer', isLoggedInUser.isLoggedIn, discounts.filterOffer);

export default discountRouter;
