const mongoose = require('mongoose');

const userSchema = new mongoose.Schema(
	{
		firstname: {
			type: String,
			// required: true,
		},
		lastname: {
			type: String,
			// required: true,
		},
		password: {
			// type: String,
		},
		email: {
			type: String,
		},
		phone: {
			type: String,
		},
		gender: {
			type: String,
			// required: true,
		},
		userType: {
			type: String,
			default: 'user',
		},
		imageUrl: {
			type: String,
			default: '',
		},
		OTP: {
			type: Number,
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('User', userSchema);
