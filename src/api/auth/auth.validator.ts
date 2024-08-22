import { Role } from '@common/constants/role';
import { Joi, schema } from 'express-validation';

export const auth: schema = {
    body: Joi.object({
        name: Joi.string().required().min(1).max(20),
        password: Joi.string()
            .required()
            .regex(/[a-zA-Z0-9]{3,30}/),
        role: Joi.string().required().valid(Role.USER, Role.MOD),
    }),
};
