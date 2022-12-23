import * as Joi from 'joi';
import { EnvironmentVariables } from './environment.config';

export const EnvironmentSchema = Joi.object()
  .keys({
    [EnvironmentVariables.HOST]: Joi.string().default('localhost'),
    [EnvironmentVariables.PORT]: Joi.number().default(3000),

    // Database
    [EnvironmentVariables.MONGODB_URI]: Joi.string().required(),

    // Authentication
    [EnvironmentVariables.JWT_SECRET]: Joi.string().required(),
    [EnvironmentVariables.JWT_EXPIRES_IN]: Joi.string().required(),
    [EnvironmentVariables.SECRET]: Joi.string().required(),
  })
  .options({ stripUnknown: true });
