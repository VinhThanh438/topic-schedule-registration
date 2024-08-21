import logger from '@common/logger';
import ModSchedule, { IModScheduleResponse } from './Mod-schedule.model';
import { IModCanceled, IModScheduleCanceled } from '@common/mod/mod.interface';
import eventBus from '@common/event-bus';
import { EVENT_MOD_SCHEDULED } from '@common/constants/event.constant';

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

            eventBus.emit(EVENT_MOD_SCHEDULED, { mod_id: data.mod_id });

            return data.transform();
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }
}
