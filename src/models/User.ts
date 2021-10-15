import { Schema, model } from 'mongoose';

export interface UserType {
	id: string;
	email: string;
	name: string;
	authType: 'google' | 'local';
	hashedPassword?: string;
	googleId?: string;
	displayPicture?: string;
	isAdmin?: boolean;
}

const userSchema = new Schema<UserType>({
	email: {
		type: String,
		required: true,
	},
	authType: {
		type: String,
		required: true,
	},
	hashedPassword: {
		type: String,
		required: function (this: UserType) {
			return this.authType === 'local';
		},
	},
	googleId: {
		type: String,
		required: function (this: UserType) {
			return this.authType === 'google';
		},
	},
	name: {
		type: String,
		required: true,
	},
	displayPicture: {
		type: String,
		required: function (this: UserType) {
			return this.authType === 'google';
		},
	},
});

export const User = model<UserType>('User', userSchema);
