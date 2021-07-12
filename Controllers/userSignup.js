import bcryptjs from 'bcryptjs';
import status from 'http-status';
import Model from '../Models/Model';
import awsHandler from './aws';

const accountSid = 'AC11023c3c58e4fba42dd0bc350c5b6eb4';
const authToken = 'bbab81987118e9053127e53fee7f9298';
const client = require('twilio')(accountSid, authToken);

const sendOTP = (req, res, next) => {
	const { phone } = req.body;
	const num = Math.floor(Math.random()*10000);
const query = { phone };

				Model.UserModel.findOne(query)
					.then((user) => {
						if (user) {
							if (user.phone == phone) {
								res.status(400);
								next(new Error('Phone Already Taken.'));
							}
						} else {
	const event = new Model.UserModel({
		phone,
		OTP:num,
	});
	event
		.save()
		.then(savedEvent => {
			client.messages
			.create({
				body: num,
				from: '+13125868332',
				to: req.body.phone
				})
				.then(message => 
				console.log(message.sid))
				.catch(err => console.log('errrr' , err));
			
			res.status(status.OK).send({
				// eslint-disable-next-line no-underscore-dangle
				id:savedEvent._id,
				Message: 'OTP send Successfully',
				type: status.Ok,
			});
		})
		.catch(err => {
			res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: status.INTERNAL_SERVER_ERROR,
				err,
			});
		});
						}
					})
					.catch((err) => {
						res.status(500);
						next(new Error(err));
					});
};

const userSignUp = (req, res, next) => {
	const { firstname, lastname, password, email, gender, phone, imageUrl } = req.body;
	// const num = Math.floor(Math.random()*10000);
	if (imageUrl !== '' && req.file !== undefined) {
		awsHandler
			.UploadToAws(req.file)
			.then((image) => {
				const query = { email };

				Model.UserModel.findOne(query)
					.then((user) => {
						if (user) {
							if (user.email == email) {
								res.status(400);
								next(new Error('Email Already Taken.'));
							}
						} else {
							bcryptjs.hash(password, 12).then((hashedpassword) => {
								const User = new Model.UserModel({
									firstname,
									lastname,
									password: hashedpassword,
									email,
									gender,
									phone,
									imageUrl: image,
									userType: 'user',
									// OTP: num
								});
								// console.log(User);
								User.save()
									.then((SavedUser) => {
										console.log(SavedUser);
										// client.messages
										// .create({
										// 	body: num,
										// 	from: '+13125868332',
										// 	to: req.body.phone
										// 	})
										// 	.then(message => 
										// 	console.log(message.sid))
										// 	.catch(err => console.log('errrr' , err));
										return res.status(200).send({
											Message: 'Account Created Successfully .',
											SavedUser,
										});
									})
									.catch((err) => {
										res.status(500);
										next(
											new Error(
												`Unable to Create User. Please Try later. ${err}`,
											),
										);
									});
							});
						}
					})
					.catch((err) => {
						res.status(500);
						next(new Error(err));
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

const verifyOTP = (req, res) => {
	Model.UserModel.findOne({ _id: req.body.id })
		.then(event => {
			if (!event) {
				return res.status(status.NOT_FOUND).send({
					Message: 'User not found',
				});
			}
			// return res.status(status.OK).send(event);
			Model.UserModel.findOne({ _id: req.body.id , OTP: req.body.otp })
			.then(event2 => {
				if (!event2) {
				return res.status(status.NOT_FOUND).send({
					Message: 'OTP not found',
				});
			}
			return res.status(status.OK).send({result: 'OTP matched'});
		})
		.catch(err => {
			return res.status(status.INTERNAL_SERVER_ERROR).send({
				Message: 'Internal Server Error',
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

const completeProfile = (req, res) => {
	const { id } = req.params;
	console.log(req.body);
	bcryptjs.hash(req.body.password, 12).then((hashedpassword) => {
		const data = { 
		firstname:req.body.firstname,
		lastname:req.body.lastname,
		gender:req.body.gender,
		password : hashedpassword
	};
	console.log(data);
		const query = { $set: data };

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
	});
};

export default {sendOTP, userSignUp , verifyOTP , completeProfile };
