import {Random} from 'random-test-values';
import {createVendor} from '../../../src/domain/vendor/vendor';
import {errors} from '../../../src/infrastructure/configuration';

const {ValidationConstraintError} = errors;

describe('create vendor', () => {
    const vendorId = Random.String();
    const name = Random.String();
    const vendorState = 'pendingReview';
    const cuisineType = Random.String();
    const contactEmail = Random.String();
    const contactPhone = Random.String();
    const michelinStars = Random.Number({min: 0, max: 3});
    const version = 0;

    describe('with basic parameters', () => {
        // Given
        const mockUuidv4Fn = jest.fn(() => vendorId);

        const expectedResult = {
            vendorId,
            version,
            name,
            vendorState,
            cuisineType,
            contactEmail,
            contactPhone,
        };

        it('should create a new vendor', async () => {
            // When
            const result = await createVendor({
                uuidv4Fn: mockUuidv4Fn,
                name,
                vendorState,
                cuisineType,
                contactEmail,
                contactPhone,
            });

            // Then
            expect(result).toEqual(expectedResult);
        });

        describe('with invalid michelinStars', () => {
            // Given
            const invalidMichelinStars = Random.Number({min: 4});
            const expectedError = new ValidationConstraintError('ValidationError: "michelinStars" must be a safe number');
            it('should not return a valid Vendor', async () => {
                // When
                // Then
                await expect(createVendor({
                    uuidv4Fn: mockUuidv4Fn,
                    name,
                    vendorState,
                    cuisineType,
                    contactEmail,
                    contactPhone,
                    michelinStars: invalidMichelinStars,
                })).rejects.toThrow(expectedError);
            });
        });
    });

    describe('with full parameters', () => {
        // Given
        const mockUuidv4Fn = jest.fn(() => vendorId);
        const existingVersionNumber = Random.Number({min: 3, max: 900});

        const expectedResult = {
            vendorId,
            name,
            vendorState,
            cuisineType,
            contactEmail,
            contactPhone,
            michelinStars,
            version: existingVersionNumber
        };

        it('should return validated vendor', async () => {
            // When
            const result = await createVendor({
                uuidv4Fn: mockUuidv4Fn,
                name,
                vendorState,
                cuisineType,
                contactEmail,
                contactPhone,
                michelinStars,
                version: existingVersionNumber,
            });

            // Then
            expect(result).toEqual(expectedResult);
        });
    });
});
