import logger from '@common/logger';
import ModSchedule, { IModScheduleResponse } from './Mod-schedule.model';

export class ModScheduleService {
    static async updateAvailableSchedule(req: any): Promise<IModScheduleResponse> {
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
