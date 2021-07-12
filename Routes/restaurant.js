import express from 'express';
import multer from 'multer';
import restaurants from '../Controllers/restaurant';

// auth middlewares for admin
// import isAdminMiddleware from '../Middlewares/isManager';
// auth middleware for user
import isLoggedInUser from '../Middlewares/loggedIn';

const storage = multer.memoryStorage();
const upload = multer({
	storage,
});
const restaurantRouter = express.Router();

restaurantRouter.post(
	'/add',
	isLoggedInUser.isLoggedIn,
	restaurants.addRestaurant,
);

restaurantRouter.get('/', isLoggedInUser.isLoggedIn, restaurants.getRestaurants);

restaurantRouter.get('/:eid', isLoggedInUser.isLoggedIn, restaurants.getSingleRestaurant);

restaurantRouter.patch('/edit/:id', isLoggedInUser.isLoggedIn, restaurants.editRestaurant);

restaurantRouter.delete('/delete/:id', isLoggedInUser.isLoggedIn, restaurants.deleteRestaurant);

restaurantRouter.patch('/menu/:id', isLoggedInUser.isLoggedIn, 	upload.single('menu'), restaurants.uploadMenu);

restaurantRouter.patch('/pictures/:id', isLoggedInUser.isLoggedIn, 	upload.array('images'), restaurants.addPictures);

export default restaurantRouter;
