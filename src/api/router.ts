import express from 'express';
import userRoutes from './user/user.route';
import modRoutes from './mod/mod.route';
const router = express.Router();

router.use('/user', userRoutes);
router.use('/mod', modRoutes);

export default router;
