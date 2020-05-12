import { logger, errors } from '../../../infrastructure/configuration';
import createVendor from '../../../domain/vendor/create_vendor';
import readVendor from '../../../adapters/persistence/vendor_repository/read_vendor';
import applyVendorStateDomainService from '../../../domain/service/vendor/apply_vendor_state';
import saveVendor from '../../../adapters/persistence/vendor_repository/save_vendor';
import publishEvent from '../../../adapters/event_publisher/publishEvent';

const { NonExistentItemError, InvalidOperationError } = errors;

const publishVendorUpdatedEvent = async ({ vendor, previousVendorState }) => {
  logger.info('Publishing vendorUpdated Event');
  const vendorUpdatedEvent = {
    type: 'vendorUpdated',
    change: 'vendorState',
    previousState: previousVendorState,
    newState: vendor.vendorState,
    vendor,
  };
  await publishEvent({ event: vendorUpdatedEvent });
};

// TODO: This function is too long and messy, needs a re-think...
const setVendorStateCommandService = async ({ vendorState, vendorId }) => {
  try {
    logger.info(`setVendorStateCommandService called to set vendorId:${vendorId} to vendorState:${vendorState}`);

    logger.info('Getting Vendor by vendorId from persistence');
    const { vendor: vendorItem } = await readVendor({ vendorId });
    logger.debug('Found vendorItem from persistence:');
    logger.debug(JSON.stringify(vendorItem));

    logger.debug('Validating Vendor');
    const vendorCdm = await createVendor(vendorItem);
    if (vendorState === vendorCdm.vendorState) {
      logger.info('Vendor attribute "vendorState" is already the requested value');
      logger.info('No update to Vendor required');
      return { vendor: vendorCdm };
    }

    logger.info('Setting new Vendor State');
    const { vendor } = await applyVendorStateDomainService({ vendor: vendorCdm, newVendorState: vendorState });
    logger.debug(`Vendor update compleated, new vendor state: ${JSON.stringify(vendor)}`);

    logger.info('Vendor state updated, attempting save');
    await saveVendor(vendor);
    logger.info('Successfully Saved Vendor Update');

    await publishVendorUpdatedEvent({ vendor, previousVendorState: vendorCdm.vendorState });

    return { vendor };
  } catch (error) {
    if (error instanceof NonExistentItemError) {
      logger.error(`setVendorStateCommandService failed to get vendor by supplied vendorId:${vendorId}`);
      logger.error('Cannot set state of a vendor that does not exist');
      // Rethrow as an application layer error
      throw new InvalidOperationError('Vendor does not exist');
    }

    logger.error('Caught error in setVendorStateCommandService');
    logger.error(`Failed to set state:${vendorState} for vendorId:${vendorId}`);
    logger.error(error);
    throw new Error('Unknown failure in setVendorCommandService');
  }
};


export default setVendorStateCommandService;
