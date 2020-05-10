import fetch from 'node-fetch';
import { logger } from '../../../infrastructure/configuration';

// Each of these URLs relates to a distinct zapier "zap" that has been created in the zapier web console
const listURLs = {
  newVendors: 'https://hooks.zapier.com/hooks/catch/7462410/or88vbu/',
};

const createCard = async ({ cardTitle, cardContents, listName }) => {
  try {
    logger.info(`Requesting new Trello card with title:${cardTitle} for list:${listName}`);
    logger.info(`Using webhook URL:${listURLs[listName]}`);

    const trelloPayload = {
      cardTitle,
      cardContents,
    };

    // Send request to Zapier for card creation
    await fetch(listURLs[listName], {
      method: 'post',
      body: JSON.stringify(trelloPayload),
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    logger.error('Failed in request to create Trello card');
    logger.error(error);
  }
};

export default createCard;
