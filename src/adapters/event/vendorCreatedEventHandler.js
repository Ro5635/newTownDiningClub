import fetch from 'node-fetch';
import { logger } from '../../infrastructure/configuration';

export const handler = async ({ detail }) => {
  try {
    logger.info('vendorCreatedEventHandler Called');
    logger.debug('received event:');
    logger.debug(JSON.stringify(detail));

    const { vendor } = detail;

    logger.info(`CaughtEvent !!!!!`);

  } catch (error) {
    logger.error('Error caught in event handler');
    logger.error(error.message);
    logger.error(error.stack);
  }
};

export default {};
