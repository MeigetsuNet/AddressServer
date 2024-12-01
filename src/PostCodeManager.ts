import { readJson } from 'nodeeasyfileio';

type PostCodeFileDataBaseObject = {
    postcode: string;
    prefecture: string;
    city: string;
    address?: string;
};

type PostCodeFileDataBaseObjectJson = {
    postcodes: PostCodeFileDataBaseObject[];
};

type PostCodeCache = {
    textPostCode: string;
    postcode: number;
    prefecture: string;
    city: string;
    address?: string;
};

export default class PostCodeManager {
    constructor(private PostCodeFilePath: string = './system/postcode.json') {}
    private PostCodeFileDataJson: PostCodeFileDataBaseObjectJson = { postcodes: [] };
    private ReadPostCodeFileData() {
        const Record =
            this.PostCodeFileDataJson.postcodes.length === 0
                ? readJson<PostCodeFileDataBaseObjectJson>(this.PostCodeFilePath)
                : this.PostCodeFileDataJson;
        if (process.env.MG_MEMORY_SAVE_MODE !== 'true') this.PostCodeFileDataJson = Record;
        return Record;
    }
    private get PostCodeRecords(): PostCodeCache[] {
        const PostCodeFileDataJson = this.ReadPostCodeFileData();
        return PostCodeFileDataJson.postcodes
            .map((i: PostCodeFileDataBaseObject): PostCodeCache => {
                return {
                    textPostCode: i.postcode,
                    postcode: parseInt(i.postcode),
                    prefecture: i.prefecture,
                    city: i.city,
                    address: i.address,
                };
            })
            .sort((a: PostCodeCache, b: PostCodeCache) => a.postcode - b.postcode);
    }
    private InternalGetPostCodeInformation(
        PostCode: number,
        range: { begin: number; end: number }
    ): PostCodeFileDataBaseObject | null {
        const CreateReturn = (Data: PostCodeCache | undefined): PostCodeFileDataBaseObject | null => {
            if (Data == null) return null;
            return Data.address == null
                ? {
                      postcode: Data.textPostCode,
                      prefecture: Data.prefecture,
                      city: Data.city,
                  }
                : {
                      postcode: Data.textPostCode,
                      prefecture: Data.prefecture,
                      city: Data.city,
                      address: Data.address,
                  };
        };
        if (PostCode === this.PostCodeRecords[range.begin].postcode)
            return CreateReturn(this.PostCodeRecords[range.begin]);
        if (PostCode === this.PostCodeRecords[range.end].postcode) return CreateReturn(this.PostCodeRecords[range.end]);
        const Center: number = Math.floor((range.end - range.begin) / 2) + range.begin;
        if (PostCode === this.PostCodeRecords[Center].postcode) return CreateReturn(this.PostCodeRecords[Center]);
        else {
            if (range.end - range.begin <= 22)
                return CreateReturn(
                    this.PostCodeRecords.slice(range.begin + 1, range.end).find(i => i.postcode === PostCode)
                );
            else
                return PostCode > this.PostCodeRecords[Center].postcode
                    ? this.InternalGetPostCodeInformation(PostCode, { begin: Center + 1, end: range.end })
                    : this.InternalGetPostCodeInformation(PostCode, { begin: range.begin, end: Center - 1 });
        }
    }
    public GetPostCodeInformation(PostCode: string) {
        return this.InternalGetPostCodeInformation(parseInt(PostCode), {
            begin: 0,
            end: this.PostCodeRecords.length - 1,
        });
    }
}
