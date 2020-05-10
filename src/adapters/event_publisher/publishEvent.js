import { logger, eventBridge, environment } from '../../infrastructure/configuration';

const { VENDOR_EVENT_BUS_NAME } = environment;
const defaultEventSource = 'NTDCService';

const publishEvent = async ({ event, eventBusName = VENDOR_EVENT_BUS_NAME, eventSource = defaultEventSource }) => {
  try {
    logger.info(`Attempting to publish event to ${eventBusName} for ${eventSource}`);
    logger.debug('Event for publish:');
    logger.debug(JSON.stringify(event));

    const params = {
      Entries: [
        {
          Detail: JSON.stringify(event),
          DetailType: event.type,
          EventBusName: eventBusName,
          Source: eventSource,
          Time: new Date(),
        },
      ],
    };

    await eventBridge.putEvents(params).promise();
    logger.info(`Published Event to ${eventBusName} successfully`);

  } catch (error) {
    logger.error('Failed to publish event!');
    logger.error(error);
  }
};

export default publishEvent;
