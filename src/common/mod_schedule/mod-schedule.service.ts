import logger from '@common/logger';
import ModSchedule, { IModScheduleResponse } from './Mod-schedule.model';
import { IModCanceled, IModScheduleCanceled } from '@common/mod/mod.interface';

export class ModScheduleService {
    static async updateAvailableSchedule(req: IModCanceled): Promise<IModScheduleResponse> {
        try {
            const data = await ModSchedule.findOneAndUpdate(
                {
                    _id: req.mod_schedule_id,
                    is_available: false,
                },
                {
                    is_available: true,
                },
            );

            if (!data) throw new Error('Cannot update available mod schedule!');
            return data.transform();
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }
}
