import createVendor from '../../../domain/vendor/create_vendor';
import { logger } from '../../../infrastructure/configuration';
import saveVendor from '../../../adapters/persistence/vendor_repository/save_vendor';
import publishEvent from '../../../adapters/event_publisher/publishEvent';

const createVendorCommandService = async ({
  name, cuisineType, contactEmail, contactPhone, michelinStars,
}) => {
  logger.info('createVendorCommandService: creating new vendor');

  const vendor = await createVendor({
    name,
    cuisineType,
    contactEmail,
    contactPhone,
    michelinStars,
  });

  await saveVendor(vendor);

  const event = {
    type: 'vendorCreated',
    vendor,
  };
  await publishEvent({ event });

  return vendor;
};

export default createVendorCommandService;
