import AddressManager from './AddressManager';
import { readJson } from 'nodeeasyfileio';

jest.mock('nodeeasyfileio');

describe('AddressManager', () => {
    const mockAddressData = {
        Tokyo: {
            Shibuya: ['Address1', 'Address2'],
            Shinjuku: ['Address3', 'Address4']
        },
        Osaka: {
            Namba: ['Address5', 'Address6'],
            Umeda: ['Address7', 'Address8']
        }
    };

    beforeEach(() => {
        (readJson as jest.Mock).mockReturnValue(mockAddressData);
    });

    it('should return all prefectures', () => {
        const manager = new AddressManager();
        const prefectures = manager.GetPrefectures();
        expect(prefectures).toEqual(['Tokyo', 'Osaka']);
    });

    it('should return all cities for a given prefecture', () => {
        const manager = new AddressManager();
        const cities = manager.GetCities('Tokyo');
        expect(cities).toEqual(['Shibuya', 'Shinjuku']);
    });

    it('should return null if the prefecture does not exist', () => {
        const manager = new AddressManager();
        const cities = manager.GetCities('Kyoto');
        expect(cities).toBeNull();
    });

    it('should return all addresses for a given city in a prefecture', () => {
        const manager = new AddressManager();
        const addresses = manager.GetAddresses('Tokyo', 'Shibuya');
        expect(addresses).toEqual(['Address1', 'Address2']);
    });

    it('should return null if the city does not exist in the given prefecture', () => {
        const manager = new AddressManager();
        const addresses = manager.GetAddresses('Tokyo', 'Akihabara');
        expect(addresses).toBeNull();
    });

    it('should return null if the prefecture does not exist when getting addresses', () => {
        const manager = new AddressManager();
        const addresses = manager.GetAddresses('Kyoto', 'Gion');
        expect(addresses).toBeNull();
    });
});