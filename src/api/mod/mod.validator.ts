import { ModScheduleTypes } from '@common/constants/mod-schedule-types';
import { Joi, schema } from 'express-validation';

export const createModSchedule: schema = {
    body: Joi.object({
        mod_id: Joi.string().required().min(24).max(24),
        type: Joi.string()
            .required()
            .valid(ModScheduleTypes.MORNING, ModScheduleTypes.AFTERNOON, ModScheduleTypes.EVENING),
        date: Joi.string().required(),
    }),
};

export const handleTopicScheduleRoom: schema = {
    body: Joi.object({
        mod_schedule_id: Joi.string().required().min(24).max(24),
        schedule_room_id: Joi.string().required().min(24).max(24),
    }),
};

export const cancelSchedule: schema = {
    body: Joi.object({
        mod_schedule_id: Joi.string().required().min(24).max(24),
    }),
};
