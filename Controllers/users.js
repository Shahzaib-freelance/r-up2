import status from 'http-status';
import { ObjectId } from 'mongodb';
import Model from '../Models/Model';
import awsHandler from './aws';

const getusers = (req, res) => {
	Model.UserModel.find()
		.then(events => {
			res.status(status.OK).send(events);
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'No Events!',
				err,
			});
		});
};

const getuserById = (req, res) => {
	// eslint-disable-next-line no-underscore-dangle
	Model.UserModel.findOne({ _id: req.user._id })
		.then(event => {
			if (!event) {
				return res.status(status.NOT_FOUND).send({
					Message: 'Boat not found',
				});
			}
			return res.status(status.OK).send(event);
		})
		.catch(err => {
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Internal Server Error',
				err,
			});
		});
};


const editProfile = (req, res) => {
	const { id } = req.params;
	const query = { $set: req.body };
	Model.UserModel.findByIdAndUpdate(id, query, { new: true }, (err, result) => {
		if (err) {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Update.',
			});
		} else {
			res.status(status.OK).send({
				Message: 'Successfully Updated.',
				result,
			});
		}
	});
};

const addReview = (req, res) => {
	const { restaurantId, review } = req.body;
	
	// eslint-disable-next-line no-underscore-dangle
	Model.UserModel.findOne({ _id: req.user._id })
		.then(event => {
			if (!event) {
				return res.status(status.NOT_FOUND).send({
					Message: 'Boat not found',
				});
			}
			// return res.status(status.OK).send(event);
			const event2 = new Model.ReviewModel({
				restaurantId,
				review,
				username:`${event.firstname  } ${  event.lastname}`,
				userImage: event.imageUrl
				});
				event2
				.save()
				.then(savedEvent => {
					res.status(status.OK).send({
						savedEvent,
						Message: 'Event Created Successfully',
						type: status.Ok,
						});
						})
				.catch(err => {
					res.status(status.INTERNAL_SERVER_ERROR).send({
						Message: status.INTERNAL_SERVER_ERROR,
						err,
						});
						});
						})
		.catch(err => {
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Internal Server Error',
				err,
			});
		});
	
};

const getReviewById = (req, res) => {
	
	Model.ReviewModel.find({ 'restaurantId': ObjectId(req.params.id) })
		.then(event => {
			if (!event) {
				return res.status(status.NOT_FOUND).send({
					Message: 'Boat not found',
				});
			}
			return res.status(status.OK).send(event);
		})
		.catch(err => {
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Internal Server Error',
				err,
			});
		});
};

const adduserImage = (req, res , next) => {
	const { imageUrl } = req.body;

	if (imageUrl !== '' && req.file !== undefined) {
		awsHandler
			.UploadToAws(req.file)
			.then((image) => {
	const query = { $set: {imageUrl:image} };

	// eslint-disable-next-line no-underscore-dangle
	Model.UserModel.findByIdAndUpdate(req.user._id, query, { new: true }, (err, result) => {
		if (err) {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Update.',
			});
		} else {
			res.status(status.OK).send({
				Message: 'Successfully Updated.',
				result,
			});
		}
	});

	})
			.catch((err) => {
				res.status(500);
				next(new Error(err));
			});
	} else {
		res.status(500);
		next(new Error('Image is required'));
	}
};
export default { getusers, getuserById , editProfile , addReview , getReviewById , adduserImage};
