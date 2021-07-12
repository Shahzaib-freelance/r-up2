import mongoose from 'mongoose';

const RestaurantSchema = new mongoose.Schema(
	{
		name: {
			type: String,
			required: true,
		},
        about: {
			type: String,
		},
		phone: {
			type: Number,
		},
        lat: {
			type: Number,
		},
        lng: {
			type: Number,
		},
        averagePrice: {
			type: String,
		},
		workTime: {
			type: String,
		},
		timeReciept: {
			type: String,
		},
        website: {
			type: String,
		},
        social: {
			type: String,
		},
        personPerTable: {
			type: Number,
		},
        smoking: {
			type: Number,
		},
        nonSmoking: {
			type: Number,
		},
		menu: {
			type: String,
			default:''
		},
        images: [],

	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Restaurant', RestaurantSchema);
