import { GenerateTime } from '@common/utils/generate-time';
import {
    IModCanceled,
    IModConfirm,
    IModCreate,
    IModScheduleCanceled,
    IModSchedules,
    IModScheduling,
} from './mod.interface';
import Mod from './Mod.model';
import logger from '@common/logger';
import eventBus from '@common/event-bus';
import { ModStatus } from './mod-status';
import ModSchedule from '@common/mod_schedule/Mod-schedule.model';
import TopicScheduleRoom, {
    ITopicScheduleRoomResponse,
} from '@common/topic-schedule-room/Topic-schedule-room.model';
import { RoomStatus } from '@common/topic-schedule-room/topic-schedule-room-status';
import {
    EVENT_CANCEL_AFTER_CONFIRMATION,
    EVENT_MOD_CONFIRMED,
    EVENT_MOD_SCHEDULE_CANCELED,
    EVENT_TOPIC_ROOM_CANCELED,
} from '@common/constants/event.constant';
import User, { IUserResponse } from '@common/user/User.model';
import { IUserEvent } from '@common/user/user.interface';
import mongoose from 'mongoose';

export class ModService {
    static async getOnlines(): Promise<any> {
        try {
            return await Mod.find({ status: ModStatus.ONLINE });
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    static async getModeSchedules(mod_id: string): Promise<any> {
        try {
            return await ModSchedule.find({ mod_id, is_deleted: false, is_available: true });
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    static async modScheduled(req: IModScheduling): Promise<any> {
        try {
            new GenerateTime(req.mod_id, req.type, new Date(req.date));
            let generateTime = GenerateTime.generate();

            const bulkOperations = generateTime.map((data) => ({
                updateOne: {
                    filter: { mod_id: req.mod_id, start_time: data.start_time },
                    update: { $setOnInsert: data, is_available: true },
                    upsert: true,
                },
            }));

            const result = await ModSchedule.bulkWrite(bulkOperations);

            return result.getRawResponse();
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    static async confirmTopicScheduleRoom(req: IModConfirm): Promise<ITopicScheduleRoomResponse> {
        try {
            const modScheduleData = await ModSchedule.findOneAndUpdate(
                {
                    _id: req.mod_schedule_id,
                    is_available: true,
                },
                { is_available: false },
            );

            if (!modScheduleData) throw new Error('This schedule has been confirmed!');
            else {
                const data = await TopicScheduleRoom.findOneAndUpdate(
                    {
                        _id: req.schedule_room_id,
                        status: RoomStatus.PENDING,
                    },
                    {
                        status: RoomStatus.MOD_CONFIRMED,
                    },
                );

                eventBus.emit(EVENT_MOD_CONFIRMED, { mod_schedule_id: data.mod_schedule_id });

                return data.transform();
            }
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    static async cancelTopicScheduleRoom(req: IModCanceled): Promise<ITopicScheduleRoomResponse> {
        try {
            const data = await TopicScheduleRoom.findOneAndUpdate(
                {
                    _id: req.schedule_room_id,
                    status: RoomStatus.PENDING,
                },
                {
                    status: RoomStatus.MOD_CANCELED,
                },
            );

            if (!data)
                throw new Error('cannot canceled this schedule, topic_schedule_room not found!');
            else {
                eventBus.emit(EVENT_TOPIC_ROOM_CANCELED);
                return data.transform();
            }
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    static async cancelConfirmation(req: IModCanceled): Promise<ITopicScheduleRoomResponse> {
        try {
            const data = await TopicScheduleRoom.findOneAndUpdate(
                {
                    _id: req.schedule_room_id,
                    status: RoomStatus.MOD_CONFIRMED,
                },
                {
                    status: RoomStatus.MOD_CANCELED,
                },
            );

            if (!data)
                throw new Error('cannot canceled this schedule, topic_schedule_room not found!');
            else {
                eventBus.emit(EVENT_CANCEL_AFTER_CONFIRMATION, { user_id: data.user_id });
                return data.transform();
            }
        } catch (error) {
            logger.error(error.message);
            throw error;
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
            throw error;
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

            if (data) {
                eventBus.emit(EVENT_MOD_SCHEDULE_CANCELED, {
                    mod_schedule_id: req.mod_schedule_id,
                });
                return true;
            }
            return false;
        } catch (error) {
            logger.error(error.message);
            throw error;
        }
    }

    static async modScheduleCanceledEvent(req: IModScheduleCanceled): Promise<void> {
        const session = await mongoose.startSession();
        try {
            session.startTransaction();
            const topicScheduleRooms = await TopicScheduleRoom.find({
                mod_schedule_id: req.mod_schedule_id,
                status: { $in: [RoomStatus.PENDING, RoomStatus.MOD_CONFIRMED] },
            });

            if (topicScheduleRooms.length === 0) {
                session.endSession();
                return;
            } else {
                const data = await TopicScheduleRoom.updateMany(
                    {
                        mod_schedule_id: req.mod_schedule_id,
                        status: { $in: [RoomStatus.PENDING, RoomStatus.MOD_CONFIRMED] },
                    },
                    { $set: { status: RoomStatus.MOD_CANCELED } },
                );

                const userIds = topicScheduleRooms.map((room) => room.user_id);

                await User.updateMany(
                    {
                        _id: { $in: userIds },
                    },
                    { $inc: { remaining_lessions: 1 } },
                );

                await session.commitTransaction();
                session.endSession();

                logger.info('Mod schedule canceled successfully!');
            }
        } catch (error) {
            session.abortTransaction().catch((err) => {
                session.endSession();
                throw new Error(err.message);
            });
            session.endSession();
            logger.error(error.message);
            throw error;
        }
    }
}
