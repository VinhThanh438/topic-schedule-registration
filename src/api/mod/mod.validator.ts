import { Joi, schema } from 'express-validation';

export const createMod: schema = {
    body: Joi.object({
        mod_name: Joi.string().required(),
    }),
};

export const createModSchedule: schema = {
    body: Joi.object({
        mod_id: Joi.string().required(),
        type: Joi.string().required(),
        date: Joi.date().required(),
    }),
};

export const handleTopicScheduleRoom: schema = {
    body: Joi.object({
        schedule_room_id: Joi.string().required(),
    }),
};

export const cancelSchedule: schema = {
    body: Joi.object({
        mod_schedule_id: Joi.string().required(),
    }),
};
