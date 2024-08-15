import logger from '@common/logger';
import { IUserCreate, IUserScheduled } from './user.interface';
import User from './User.model';
import TopicScheduleRoom, {
    ITopicScheduleRoom,
} from '@common/topic-schedule-room/Topic-schedule-room.model';
import ModSchedule from '@common/mod_schedule/Mod-schedule.model';
import { RoomStatus } from '@common/topic-schedule-room/topic-schedule-room-status';

export class UserService {
    static async createUser(req: IUserCreate): Promise<void> {
        try {
            await User.create(
                new User({
                    user_name: req.user_name,
                }),
            );
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async checkRemainingLession(userId: string): Promise<Boolean> {
        try {
            const userData = await User.findOne({
                _id: userId,
                remaining_lessions: { $lte: 0 },
            });

            if (userData) return false;
            else return true;
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async checkDuplicateSchedule(req: IUserScheduled): Promise<Boolean> {
        try {
            const modScheduleId = req.mod_schedule_id;

            const checkData = await ModSchedule.findOne({ _id: modScheduleId, is_available: true });

            if (checkData) return true;
            else return false;
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async userScheduled(req: IUserScheduled): Promise<ITopicScheduleRoom> {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.user_id },
                { $inc: { remaining_lessions: -1 } },
            );

            if (userData) {
                const data = await TopicScheduleRoom.create(
                    new TopicScheduleRoom({
                        mod_id: req.mod_id,
                        user_id: req.user_id,
                        mod_schedule_id: req.mod_schedule_id,
                    }),
                );

                return data;
            } else {
                logger.info('userData not found');
            }
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async cancelSchedule(req: any): Promise<ITopicScheduleRoom> {
        try {
            const data = await TopicScheduleRoom.findOneAndUpdate({
                _id: req.topic_schedule_id
            }, {
                status: RoomStatus.USER_CANCELED
            })
            return data
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
