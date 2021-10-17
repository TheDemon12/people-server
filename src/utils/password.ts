import bcrypt from 'bcrypt';

export const validatePassword = async (
	password: string,
	hashedPassword: string
) => {
	const isValid = await bcrypt.compare(password, hashedPassword);
	return isValid;
};
export const generatePassword = async (password: string) => {
	const salt = await bcrypt.genSalt(10);
	const hashed = await bcrypt.hash(password, salt);

	return hashed;
};
