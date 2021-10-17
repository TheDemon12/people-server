import { model, Schema } from 'mongoose';

export interface AuthType {
	email: string;
	password: string;
}

const authSchema = new Schema<AuthType>({
	email: {
		type: String,
		minlength: 5,
		maxlength: 255,
		required: true,
		unique: true,
	},
	password: {
		type: String,
		maxlength: 1024,
		required: true,
	},
});

export const Auth = model<AuthType>('Auth', authSchema);
