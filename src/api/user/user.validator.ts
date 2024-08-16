import { Joi, schema } from 'express-validation';

export const userScheduled: schema = {
    body: Joi.object({
        mod_id: Joi.string().required(),
        user_id: Joi.string().required(),
        mod_schedule_id: Joi.string().required(),
    }),
};

export const userCanceled: schema = {
    body: Joi.object({
        topic_schedule_id: Joi.string().required(),
    }),
};
