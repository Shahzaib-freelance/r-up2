import mongoose from 'mongoose';

const ReviewSchema = new mongoose.Schema(
	{
        restaurantId: { type: mongoose.Schema.Types.ObjectId, ref: 'restaurants'},
		username: String,
		userImage: String,
		review: String,
	},
	{
		timestamps: true,
	},
);

export default mongoose.model('Reviews', ReviewSchema);
