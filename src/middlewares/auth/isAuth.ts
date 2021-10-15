import passport from 'passport';
import { RequestHandler } from 'express';

const isAuth: RequestHandler = passport.authenticate('jwt', { session: false });
export default isAuth;
