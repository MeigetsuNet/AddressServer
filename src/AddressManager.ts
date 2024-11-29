import { readJson } from 'nodeeasyfileio';

type AddressCache = {
    [prefecture: string]: {
        [city: string]: string[];
    }[];
};

export default class AddressManager {
    constructor(private AddressFilePath: string = './system/addresses.json') {}
    private get AddressRecords(): AddressCache[] {
        return readJson<AddressCache[]>(this.AddressFilePath);
    }
    public GetPrefectures(): string[] {
        return Object.keys(this.AddressRecords);
    }
    public GetCities(Prefecture: string): string[] | null {
        if (this.AddressRecords[Prefecture] == null) return null;
        return Object.keys(this.AddressRecords[Prefecture]);
    }
    public GetAddresses(Prefecture: string, City: string): string[] | null {
        if (this.AddressRecords[Prefecture] == null) return null;
        return this.AddressRecords[Prefecture][City];
    }
}
