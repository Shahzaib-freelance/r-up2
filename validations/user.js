import status from 'http-status';

const userSignup = (req, res, next) => {
	const { password, email, firstname, lastname, gender } = req.body;

	if (!firstname || !email || !password || !lastname || !gender) {
		res.status(status.BAD_REQUEST);
		next(new Error('name, email and password Must be Defined in request body'));
	} else {
		next();
	}
};

const userSignin = (req, res, next) => {
	const { password, phone } = req.body;
	if (!phone || !password) {
		res.status(status.BAD_REQUEST);
		next(new Error('email, password Must be Defined in request body'));
	} else {
		next();
	}
};

export default { userSignup, userSignin };
