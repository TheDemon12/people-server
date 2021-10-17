import passport from 'passport';
import { Request } from 'express';
import passportJwt, { VerifyCallback } from 'passport-jwt';
import { User } from 'models/User';
import { getJwtSecretKey } from 'utils/jwt';

const cookieExtractor = (
	req: Request<{}, {}, { cookies?: { jwt?: string } }>
) => {
	if (req?.cookies && req.cookies['jwt'])
		return req.cookies['jwt'].split(' ')[1];
	else return null;
};

var JwtOptions: passportJwt.StrategyOptions = {
	jwtFromRequest: cookieExtractor,
	secretOrKey: getJwtSecretKey(),
};

const verifyCallback: VerifyCallback = async (
	jwtPayload: { id: string },
	callback
) => {
	try {
		const user = await User.findById(jwtPayload.id);
		if (!user) return callback(null, false);

		return callback(null, user);
	} catch (err) {
		callback(err);
	}
};

const strategy = new passportJwt.Strategy(JwtOptions, verifyCallback);
passport.use(strategy);

passport.serializeUser((user, callback) => {
	callback(null, user.id);
});

passport.deserializeUser(async (id, callback) => {
	try {
		const user = await User.findById(id);
		if (!user) return callback(null, false);

		return callback(null, user);
	} catch (err) {
		callback(err);
	}
});
