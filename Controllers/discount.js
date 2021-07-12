import status from 'http-status';
import { ObjectId } from 'mongodb';
import Model from '../Models/Model';
import awsHandler from './aws';


const getOffers = (req, res) => {
	Model.DiscountModel.find()
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

const createOffer = (req, res, next) => {
	const { restaurantId, category, offerName, offerOn, offerPercent, offerType, offerPrice,tags, startDate, endDate,noGuests , limit,  imageUrl } = req.body;

	if (imageUrl !== '' && req.file !== undefined) {
		awsHandler
			.UploadToAws(req.file)
			.then((image) => {

								const User = new Model.DiscountModel({
                                    restaurantId,
									category,
									offerName,
									offerOn,
									offerPercent,
									offerType,
                                    offerPrice,
                                    tags,
                                    startDate,
                                    endDate,
                                    noGuests,
                                    limit,
									imageUrl: image,
								});
								// console.log(User);
								User.save()
									.then((SavedUser) => {
										console.log(SavedUser);

										return res.status(200).send({
											Message: 'Offer Created Successfully .',
											SavedUser,
										});
									})
									.catch((err) => {
										res.status(500);
										next(
											new Error(
												`Unable to Create Offer. Please Try later. ${err}`,
											),
										);
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

const getRestaurantOffers = (req, res) => {

	Model.DiscountModel.find({ 'restaurantId': ObjectId(req.params.id)  })
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

const getSingleOffer = (req, res) => {

	Model.DiscountModel.findOne({ _id: req.params.id })
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

const filterOffer = (req, res) => {

	Model.DiscountModel.find({ offerType: req.body.type })
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
export default { getOffers,  createOffer , getRestaurantOffers , getSingleOffer , filterOffer};
