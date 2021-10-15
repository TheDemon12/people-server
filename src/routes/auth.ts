import { Router } from 'express';
import { User } from 'models/User';

import { generateJWT } from 'utils/jwt';
import { generatePassword } from 'utils/password';

const router = Router();

router.post('/register', async (req, res) => {
	const { name, email, password } = req.body;

	const user = await User.findOne({ email, authType: 'local' });
	if (user) return res.status(400).send('User Already Registered!');

	const hashedPassword = await generatePassword(password);

	const newUser = new User({ name, email, authType: 'local', hashedPassword });
	await newUser.save();

	const tokenObject = generateJWT(newUser);

	return res
		.cookie('jwt', tokenObject.token, {
			httpOnly: true,
			maxAge: tokenObject.expires,
			secure: true,
		})
		.send('user registered!');
});

export default router;
