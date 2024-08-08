import logger from '@common/logger';
import { Application } from '@worker/application';

Application.createApp().then(() => {
    logger.info('Application created successfully!!!!!');
});
