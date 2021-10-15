import 'utils/dotenv';

import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';
import { connect } from 'mongoose';

import auth from 'routes/auth';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('tiny'));

const connectToDB = async () => {
	const { MONGODB_URL, DB_NAME } = process.env;

	try {
		await connect(`${MONGODB_URL}/${DB_NAME}`, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useCreateIndex: true,
		});
		console.log(`Connected to Database`);
	} catch (ex: any) {
		throw new Error(ex);
	}
};
connectToDB();

app.use('/auth', auth);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server Running on https://localhost:${PORT}`);
});
