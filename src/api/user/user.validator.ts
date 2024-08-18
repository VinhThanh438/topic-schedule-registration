import { Joi, schema } from 'express-validation';

export const userScheduled: schema = {
    body: Joi.object({
        mod_id: Joi.string().required().min(24).max(24),
        user_id: Joi.string().required().min(24).max(24),
        mod_schedule_id: Joi.string().required().min(24).max(24),
    }),
};

export const userCanceled: schema = {
    body: Joi.object({
        topic_schedule_id: Joi.string().required().min(24).max(24),
    }),
};
