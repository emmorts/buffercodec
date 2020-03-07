export declare type BufferContentType = 'float32' | 'float64' | 'int8' | 'int16' | 'int32' | 'uint8' | 'uint16' | 'uint32' | 'string';
export declare type BufferStringEncoding = 'utf8' | 'utf16';
export interface BufferTypeOptions {
    type: BufferContentType | string;
    nullable?: boolean;
    littleEndian?: boolean;
    encoding?: BufferStringEncoding;
}
export declare type BufferValueTemplate = string | string[] | BufferValueTemplate[] | {
    [key: string]: BufferValueTemplate | BufferValueTemplate[] | string | string[];
};
export declare type BufferTemplate = {
    [key: string]: BufferValueTemplate | BufferValueTemplate[] | string | string[];
};
