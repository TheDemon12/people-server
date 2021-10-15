import jwt from 'jsonwebtoken';
import { UserType } from 'models/User';

export const generateJWT = function (user: UserType) {
	const id = user.id;

	const payload = {
		sub: id,
		iat: Date.now(),
	};

	const jwtSecret = getJwtSecretKey();

	const signedToken = jwt.sign(payload, jwtSecret, {
		expiresIn: '1d',
	});

	return {
		token: 'Bearer ' + signedToken,
		expires: 1000 * 60 * 60 * 24,
	};
};

export const getJwtSecretKey = function () {
	const jwtSecret = process.env.JWT_SECRET;
	if (!jwtSecret) throw new Error('No JWT Key Found!');
	return jwtSecret;
};
