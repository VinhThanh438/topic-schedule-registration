import { GenerateTime } from '@common/utils/generate-time';
import {
    IModCanceled,
    IModConfirm,
    IModCreate,
    IModSchedules,
    IModScheduling,
} from './mod.interface';
import Mod from './Mod.model';
import mongoose from 'mongoose';
import logger from '@common/logger';
import eventBus from '@common/event-bus';
import { ModStatus } from './mod-status';
import ModSchedule from '@common/mod_schedule/Mod-schedule.model';
import TopicScheduleRoom, { ITopicScheduleRoom } from '@common/topic-schedule-room/Topic-schedule-room.model';
import { RoomStatus } from '@common/topic-schedule-room/topic-schedule-room-status';
import { EVENT_MOD_CANCELED, EVENT_ROOM_CONFIRMED } from '@common/constants/event.constant';

export class ModService {
    static async create(req: IModCreate): Promise<void> {
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

    static async getOnlineMod(): Promise<any> {
        try {
            return await Mod.find({ status: ModStatus.ONLINE });
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async getModeSchedules(req: IModSchedules): Promise<any> {
        try {
            return await ModSchedule.find({ _id: req.mod_id });
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async modScheduling(req: IModScheduling): Promise<any> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();

            new GenerateTime(req.mod_id, req.type, new Date(req.date));
            const generateTime = GenerateTime.generate();

            const data = await ModSchedule.insertMany(generateTime);

            await session.commitTransaction();
            await session.endSession();

            return data;
        } catch (error) {
            session.abortTransaction().catch((error) => {
                logger.error(error.message);
                throw new Error(error.message);
            });

            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async modConfirmed(req: IModConfirm): Promise<ITopicScheduleRoom> {
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
                const modScheduleData = await ModSchedule.findById(data.mod_schedule_id);

                eventBus.emit(EVENT_ROOM_CONFIRMED, {
                    schedule_room_id: data._id,
                    start_time: modScheduleData.start_time,
                });
                return data;
            }
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }

    static async modCanceled(req: IModCanceled): Promise<ITopicScheduleRoom> {
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
                // update user's remaining lessions
                eventBus.emit(EVENT_MOD_CANCELED, { user_id: data.user_id });
                return data;
            }
        } catch (error) {
            logger.error(error.message);
            throw new Error(error.message);
        }
    }
}
