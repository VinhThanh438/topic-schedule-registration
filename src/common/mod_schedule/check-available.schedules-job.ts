import logger from '@common/logger';
import schedule from 'node-schedule';
import { CRON_TIME } from '@common/constants/cron-job.constant';
import ModSchedules from '@common/mod_schedule/Mod-schedule.model';
import { getCurrentTimeAdjusted } from '@common/utils/get-current-time';

export class ModSchedulesAutoJob {
    public static register() {
        logger.info('Processing schedule job: check available mod schedules...');

        schedule.scheduleJob(CRON_TIME, this.checkAvailableSchedulesHanler);
    }

    private static async checkAvailableSchedulesHanler(): Promise<void> {
        try {
            await ModSchedules.updateMany(
                {
                    start_time: {
                        $lt: new Date(
                            new Date(
                                getCurrentTimeAdjusted().getTime() + 15 * 60 * 1000,
                            ).toISOString(),
                        ),
                    },
                    is_available: true,
                },
                {
                    is_available: false,
                },
            );
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }
}
