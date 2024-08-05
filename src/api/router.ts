import express from 'express';
import userRoutes from './user/user.route';
import roomRoutes from './room/room.route';
import modRoutes from './mod/mod.route';
const router = express.Router();

router.use('/user', userRoutes);
router.use('/mod', modRoutes);
router.use('/room', roomRoutes);

export default router;
