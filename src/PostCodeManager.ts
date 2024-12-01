import { readJson } from 'nodeeasyfileio';

type PostCodeLinkedInformation = {
    prefecture: string;
    city: string;
    address?: string;
};

type PostCodeInformation<PostCodeDataType> = PostCodeLinkedInformation & {
    postcode: PostCodeDataType;
};

type PostCodeFileDataBaseObjectJson = {
    postcodes: PostCodeInformation<string>[];
};

export default class PostCodeManager {
    constructor(private PostCodeFilePath: string = './system/postcode.json') {}
    private PostCodeFileDataJson: PostCodeInformation<number>[] = [];
    private get PostCodeRecords(): PostCodeInformation<number>[] {
        const Record =
            this.PostCodeFileDataJson.length === 0
                ? readJson<PostCodeFileDataBaseObjectJson>(this.PostCodeFilePath)
                      .postcodes.map((i: PostCodeInformation<string>): PostCodeInformation<number> => {
                          return {
                              postcode: parseInt(i.postcode),
                              prefecture: i.prefecture,
                              city: i.city,
                              address: i.address,
                          };
                      })
                      .sort((a: PostCodeInformation<number>, b: PostCodeInformation<number>) => a.postcode - b.postcode)
                : this.PostCodeFileDataJson;
        if (this.PostCodeFileDataJson.length === 0 && process.env.MG_MEMORY_SAVE_MODE !== 'true')
            this.PostCodeFileDataJson = Record;
        return Record;
    }
    private InternalGetPostCodeInformation(
        PostCode: number,
        range: { begin: number; end: number }
    ): PostCodeLinkedInformation | null {
        const CreateReturn = (Data: PostCodeInformation<number> | undefined): PostCodeLinkedInformation | null => {
            if (Data == null) return null;
            return Data.address == null
                ? {
                      prefecture: Data.prefecture,
                      city: Data.city,
                  }
                : {
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
    public GetPostCodeInformation(PostCode: string): PostCodeInformation<string> | null {
        const Result = this.InternalGetPostCodeInformation(parseInt(PostCode), {
            begin: 0,
            end: this.PostCodeRecords.length - 1,
        });
        return Result == null
            ? null
            : {
                  ...Result,
                  postcode: PostCode,
              };
    }
}
