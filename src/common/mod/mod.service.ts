import { GenerateTime } from '@common/utils/generate-time';
import {
    IModCanceled,
    IModConfirm,
    IModCreate,
    IModSchedules,
    IModScheduling,
} from './mod.interface';
import Mod from './Mod.model';
import logger from '@common/logger';
import eventBus from '@common/event-bus';
import { ModStatus } from './mod-status';
import ModSchedule, { IModSchedule } from '@common/mod_schedule/Mod-schedule.model';
import TopicScheduleRoom, {
    ITopicScheduleRoomResponse,
} from '@common/topic-schedule-room/Topic-schedule-room.model';
import { RoomStatus } from '@common/topic-schedule-room/topic-schedule-room-status';
import { EVENT_TOPIC_ROOM_CANCELED, EVENT_ROOM_CONFIRMED } from '@common/constants/event.constant';
import User, { IUserResponse } from '@common/user/User.model';
import { IUserEvent } from '@common/user/user.interface';

export class ModService {
    static async createMod(req: IModCreate): Promise<void> {
        try {
            await Mod.create(
                new Mod({
                    mod_name: req.mod_name,
                }),
            );
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async getOnlines(): Promise<any> {
        try {
            return await Mod.find({ status: ModStatus.ONLINE });
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async getModeSchedules(mod_id: IModSchedules): Promise<any> {
        try {
            return await ModSchedule.find({ mod_id, is_deleted: false });
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async modScheduled(req: IModScheduling): Promise<IModSchedule[]> {
        try {
            const modScheduleDatas = await ModSchedule.find({ mod_id: req.mod_id });

            new GenerateTime(req.mod_id, req.type, new Date(req.date));
            let generateTime = GenerateTime.generate();

            // generateTime = generateTime.map((e) => {
            //     for (const modScheduleData of modScheduleDatas) {
            //         if (e.start_time === modScheduleData.start_time)
            //     }
            // })

            let data = await ModSchedule.insertMany(generateTime);

            return data;
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async confirmTopicScheduleRoom(req: IModConfirm): Promise<ITopicScheduleRoomResponse> {
        try {
            const data = await TopicScheduleRoom.findOneAndUpdate(
                {
                    _id: req.schedule_room_id,
                    status: RoomStatus.PENDING,
                },
                {
                    status: RoomStatus.CONFIRMED,
                },
            );

            if (!data)
                throw new Error('cannot confirmed this schedule, topic_schedule_room not found!');
            else {
                const modScheduleData = await ModSchedule.findOneAndUpdate(
                    {
                        _id: data.mod_schedule_id,
                    },
                    { is_available: false },
                );

                if (!modScheduleData) throw new Error('modScheduleData is empty!');
                else {
                    eventBus.emit(EVENT_ROOM_CONFIRMED, {
                        schedule_room_id: data._id,
                        start_time: modScheduleData.start_time,
                    });
                    return data.transform();
                }
            }
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async cancelTopicScheduleRoom(req: IModCanceled): Promise<ITopicScheduleRoomResponse> {
        try {
            const data = await TopicScheduleRoom.findOneAndUpdate(
                {
                    _id: req.schedule_room_id,
                    status: { $in: [RoomStatus.PENDING, RoomStatus.CONFIRMED] },
                },
                {
                    status: RoomStatus.MOD_CANCELED,
                },
            );

            if (!data)
                throw new Error('cannot canceled this schedule, topic_schedule_room not found!');
            else {
                eventBus.emit(EVENT_TOPIC_ROOM_CANCELED, { user_id: data.user_id });
                return data.transform();
            }
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async lessionRefund(req: IUserEvent): Promise<IUserResponse> {
        try {
            const userData = await User.findOneAndUpdate(
                { _id: req.user_id },
                { $inc: { remaining_lessions: 1 } },
            );

            if (!userData) throw new Error('cannot update remaining_lessions. User not found!');
            else return userData.transform();
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async cancelModSchedule(req: IModSchedules): Promise<boolean> {
        try {
            const data = await ModSchedule.findOneAndUpdate(
                {
                    _id: req.mod_schedule_id,
                },
                {
                    is_deleted: true,
                },
            );

            if (data) return true;
            else return false;
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
