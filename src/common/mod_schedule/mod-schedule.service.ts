import logger from '@common/logger';
import ModSchedule, { IModSchedule } from './Mod-schedule.model';

export class ModScheduleService {
    static async updateModScheduleStatus(req: any): Promise<IModSchedule> {
        try {
            const modScheduleData = await ModSchedule.findOneAndUpdate(
                { _id: req.mod_schedule_id },
                { is_available: false },
            );

            if (!modScheduleData) throw new Error('cannot update mod schedule status!');
            else return modScheduleData;
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
