import status from 'http-status';
import Model from '../Models/Model';
import awsHandler from './aws';

const getRestaurants = (req, res) => {
	Model.RestaurantModel.find()
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

const addRestaurant = (req, res) => {
	const { name, about, phone, lat, lng , averagePrice, workTime, timeReciept, website, social, personPerTable , smoking , nonSmoking } = req.body;

	const restaurant = new Model.RestaurantModel({
		name,
		about,
		phone,
        lat,
        lng,
        averagePrice,
        workTime,
        timeReciept,
        website,
        social,
        personPerTable,
        smoking,
        nonSmoking
	});
	restaurant
		.save()
		.then(savedEvent => {
			res.status(status.OK).send({
				savedEvent,
				Message: 'Restaurant Created Successfully',
				type: status.Ok,
			});
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: status.INTERNAL_SERVER_ERROR,
				err,
			});
		});
};

const deleteRestaurant = (req, res) => {
	const { id } = req.params;
	Model.RestaurantModel.findByIdAndRemove(id, (err, result) => {
		if (result) {
			res.status(status.OK).send({
				Message: 'Event Deleted Successfully.',
			});
		} else {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Unable to Delete.',
				err,
			});
		}
	});
};

const editRestaurant = (req, res) => {
	const { id } = req.params;
	const query = { $set: req.body };
	Model.RestaurantModel.findByIdAndUpdate(id, query, { new: true }, (err, result) => {
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

const getSingleRestaurant = (req, res) => {
	const { eid } = req.params;

	Model.RestaurantModel.findOne({ _id: eid })
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


const uploadMenu = (req, res, next) => {
	const {  menu } = req.body;
	// const num = Math.floor(Math.random()*10000);
	if (menu !== '' && req.file !== undefined) {
		awsHandler
			.UploadToAws(req.file)
			.then((image) => {
				const { id } = req.params;
				const query = { $set: {menu:image} };
				Model.RestaurantModel.findByIdAndUpdate(id, query, { new: true }, (err, result) => {
					if (err) {
						res.status(status.INTERNAL_SERVER_ERROR).send({
							Message: 'Unable to Update.',
							});
							} else {
								res.status(status.OK).send({
									Message: 'Successfully Uploaded.',
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
		next(new Error('File is required'));
	}
};

const addPictures = (req, res) => {
					const { id } = req.params;

const imagesArray = [];
    if (req.files.length > 0) {
        // eslint-disable-next-line array-callback-return
        req.files.map((file, index) => {
            awsHandler
                .UploadToAws(file)
                .then(imageUrl => {
                    imagesArray.push(imageUrl);
                    if (req.files.length - 1 === index) {
                        console.log(imagesArray);
                        
                        const query = { $set: {images:imagesArray} };
				Model.RestaurantModel.findByIdAndUpdate(id, query, { new: true }, (err, result) => {
					if (err) {
						res.status(status.INTERNAL_SERVER_ERROR).send({
							Message: 'Unable to Update.',
							});
							} else {
								res.status(status.OK).send({
									Message: 'Successfully Uploaded.',
									result,
									});
									}
									});
                    }
                    console.log('jksdksdjhd');
                })
                .catch(err => {
                    res.status(500).send(err);
                });
        });
    } else {
		res.status(500).send('Cant upload image');
	}
};


export default { getRestaurants, addRestaurant, editRestaurant, getSingleRestaurant, deleteRestaurant , uploadMenu, addPictures };
