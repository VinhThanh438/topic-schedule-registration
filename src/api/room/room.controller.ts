// import logger from '@common/logger';
// import { RoomService } from '@common/room/room.service';
// import { StatusCode } from '@config/status-code';
// import { Request, Response } from 'express';

// export class RoomController {
//     static async getRoomByMod(req: Request, res: Response): Promise<void> {
//         try {
//             const id = req.params.id as any;
//             const data = await RoomService.getRoomByMod(id as any);

//             res.status(StatusCode.OK).json(data);
//         } catch (error) {
//             logger.error(error.message);
//             res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
//         }
//     }

//     static async getRoomByUser(req: Request, res: Response): Promise<void> {
//         try {
//             const id = req.params.id as any;
//             const data = await RoomService.getRoomByUser(id as any);

//             res.status(StatusCode.OK).json(data);
//         } catch (error) {
//             logger.error(error.message);
//             res.status(StatusCode.SERVER_ERROR).json({ message: error.message });
//         }
//     }
// }
