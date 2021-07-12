import mongoose from 'mongoose';

const DiscountSchema = new mongoose.Schema(
	{
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants'},
		category: String,		
		offerName: String,
		offerOn: String,
		offerPercent: Number,
		offerType: String,
		offerPrice: Number,
		tags: String,
		startDate: String,
		endDate: String,
		noGuests: Number,		
		limit: {
			type: Number,
			default: 0,
		},
		imageUrl: String,
		status: {
			type: String,
			default: 'Active',
		},
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Discounts', DiscountSchema);
