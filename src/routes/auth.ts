import { Router } from 'express';
import isAuth from 'middlewares/auth/isAuth';

import { User } from 'models/User';

import { generateJWT } from 'utils/jwt';
import { generatePassword, validatePassword } from 'utils/password';

import sendMail from 'services/mailer';

interface VerifyOTPMail {
	otp: string;
	name: string;
}

const router = Router();

router.get('/', (_req, res) => res.send('Auth Root'));

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	const user = await User.findOne({ email, authType: 'local' });
	if (user) return res.status(400).send('User Already Registered!');

	const hashedPassword = await generatePassword(password);

	const newUser = new User({
		name,
		email,
		authType: 'local',
		hashedPassword,
	});
	await newUser.save();

	const result = await sendMail<VerifyOTPMail>({
		templateName: 'verify-otp',
		templateVars: { otp: '5804', name },
		subject: 'Verify your Email Address for People',
		to: email,
	});
	console.log(result);

	return res.send('User Registered!');
});

router.post('/login', async (req, res) => {
	const { email, password } = req.body;

	const user = await User.findOne({ email, authType: 'local' });
	if (!user) return res.status(401).send('Invalid Email or Password!');

	const isValid = await validatePassword(password, user.hashedPassword!);
	if (!isValid) return res.status(401).send('Invalid Email or Password!');

	const tokenObject = generateJWT(user);

	return res
		.cookie('jwt', tokenObject.token, {
			httpOnly: true,
			maxAge: tokenObject.expires,
			// secure: true,
		})
		.send('Logged In!');
});

router.get('/protected', isAuth, (req, res) => {
	return res.status(200).send('Protected Route');
});

export default router;
