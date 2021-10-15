import 'utils/dotenv';

import express from 'express';
import cookieParser from 'cookie-parser';
import morgan from 'morgan';
import cors from 'cors';

const app = express();

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(morgan('tiny'));

app.get('/', (req, res) => {
	res.send('Hello World');
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
	console.log(`Server Running on https://localhost:${PORT}`);
});
