import { model, Schema, Types } from 'mongoose';

export interface OneTimePasswordType {
	id: string;
	userId: string;
	expiresAt: Date;
	otpValue: string;
}

const OneTimePasswordSchema = new Schema<OneTimePasswordType>({
	userId: {
		type: Types.ObjectId,
		ref: 'User',
		required: true,
	},
	expiresAt: {
		type: Date,
		default: Date.now() + 10 * 1000 * 60,
	},
	otpValue: {
		type: String,
		required: true,
	},
});

export const OneTimePassword = model<OneTimePasswordType>(
	'OneTimePassword',
	OneTimePasswordSchema
);
