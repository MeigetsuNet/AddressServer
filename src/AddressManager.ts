import { readJson } from 'nodeeasyfileio';

type AddressCache = {
    [prefecture: string]: {
        [city: string]: string[];
    };
};

export default class AddressManager {
    constructor(private AddressFilePath: string = './system/addresses.json') {}
    private AddressCacheData: AddressCache = {};
    private ReadAddressCacheData() {
        const Record = Object.keys(this.AddressCacheData).length === 0
            ? readJson<AddressCache>(this.AddressFilePath)
            : this.AddressCacheData;
        if (process.env.MG_MEMORY_SAVE_MODE !== 'true') this.AddressCacheData = Record;
        return Record;
    }
    private get AddressRecords(): AddressCache {
        return readJson<AddressCache>(this.AddressFilePath);
    }
    public GetPrefectures(): string[] {
        return Object.keys(this.AddressRecords);
    }
    public GetCities(Prefecture: string): string[] | null {
        if (this.AddressRecords[Prefecture] == null) return null;
        return Object.keys(this.AddressRecords[Prefecture]);
    }
    public GetAddresses(Prefecture: string, City: string): string[] | null {
        if (this.AddressRecords[Prefecture] == null || this.AddressRecords[Prefecture][City] == null) return null;
        return this.AddressRecords[Prefecture][City];
    }
}
