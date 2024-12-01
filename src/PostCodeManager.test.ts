import PostCodeManager from './PostCodeManager';
import { readJson } from 'nodeeasyfileio';

jest.mock('nodeeasyfileio');

describe('PostCodeManager', () => {
    const postCodeManager = new PostCodeManager();

    beforeAll(() => {
        const mockPostCodeData = {
            postcodes: [
                {
                    postcode: '1234567',
                    prefecture: 'Test Prefecture',
                    city: 'Test City',
                    address: 'Test Address',
                },
                {
                    postcode: '7654321',
                    prefecture: 'Another Prefecture',
                    city: 'Another City',
                },
                {
                    postcode: '1000000',
                    prefecture: 'Start Prefecture',
                    city: 'Start City',
                    address: 'Start Address',
                },
                {
                    postcode: '9999999',
                    prefecture: 'End Prefecture',
                    city: 'End City',
                    address: 'End Address',
                },
            ],
        };
        (readJson as jest.Mock).mockReturnValue(mockPostCodeData);
    });
    afterAll(() => {
        jest.clearAllMocks();
    });

    it('should return correct information for a valid postcode', () => {
        const result = postCodeManager.GetPostCodeInformation('1234567');
        expect(result).toEqual({
            postcode: '1234567',
            prefecture: 'Test Prefecture',
            city: 'Test City',
            address: 'Test Address',
        });
    });

    it('should return null for an invalid postcode', () => {
        const result = postCodeManager.GetPostCodeInformation('0000000');
        expect(result).toBeNull();
    });

    it('should return correct information for a postcode without address', () => {
        const result = postCodeManager.GetPostCodeInformation('7654321');
        expect(result).toEqual({
            postcode: '7654321',
            prefecture: 'Another Prefecture',
            city: 'Another City',
        });
    });

    it('should handle postcodes at the beginning of the range', () => {
        const result = postCodeManager.GetPostCodeInformation('1000000');
        expect(result).toEqual({
            postcode: '1000000',
            prefecture: 'Start Prefecture',
            city: 'Start City',
            address: 'Start Address',
        });
    });

    it('should handle postcodes at the end of the range', () => {
        const result = postCodeManager.GetPostCodeInformation('9999999');
        expect(result).toEqual({
            postcode: '9999999',
            prefecture: 'End Prefecture',
            city: 'End City',
            address: 'End Address',
        });
    });
});
