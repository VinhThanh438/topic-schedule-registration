import express from 'express';
import { AuthController } from './auth.controller';
import { validate } from 'express-validation';
import { auth } from './auth.validator';
const router = express.Router();

router.post('/login', validate(auth), AuthController.logIn);

router.post('/signup', validate(auth), AuthController.signUp);

router.get('/logout', AuthController.logOut)

export default router;
