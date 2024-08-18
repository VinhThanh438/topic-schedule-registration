import logger from '@common/logger';
import ModSchedule from './Mod-schedule.model';

export class ModScheduleService {
    static async updateAvailableSchedule(req: any): Promise<void> {
        try {
            const data = await ModSchedule.findByIdAndUpdate(
                {
                    _id: req.mod_schedule_id,
                    is_available: false,
                },
                {
                    is_available: true,
                },
            );

            if (!data) throw new Error('Cannot update available mod schedule!');
        } catch (error) {
            logger.error(error.message);
        }
    }
}
