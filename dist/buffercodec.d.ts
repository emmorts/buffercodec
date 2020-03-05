/// <reference types="node" />
export declare type BufferStringEncoding = 'utf8' | 'utf16';
export declare type BufferDecodeType = 'int8' | 'uint8' | 'int16le' | 'uint16le' | 'int16be' | 'uint16be' | 'int32le' | 'uint32le' | 'int32be' | 'uint32be' | 'float32le' | 'float32be' | 'float64le' | 'float64be' | 'string' | 'array';
export interface BufferValueProperties {
    type: BufferDecodeType;
    encoding?: BufferStringEncoding;
}
export interface BufferTemplate {
    [key: string]: BufferTemplate | BufferTemplate[] | BufferDecodeType | BufferDecodeType[];
}
export interface BufferCodecConstructorOptions {
    buffer?: ArrayBuffer;
    encoding?: BufferStringEncoding;
}
export declare class BufferCodec {
    #private;
    constructor(options?: BufferCodecConstructorOptions);
    get offset(): number;
    set offset(value: number);
    setEncoding(encoding: BufferStringEncoding): this;
    static from(buffer: Buffer | ArrayBuffer): BufferCodec;
    getBuffer(trimOffset?: boolean): ArrayBuffer;
    result(): ArrayBuffer;
    parse(template: BufferTemplate | BufferTemplate[], transform?: (result: any) => any | any[]): any | any[];
    string(value: string): BufferCodec;
    int8(value: number): BufferCodec;
    uint8(value: number): BufferCodec;
    int16(value: number, littleEndian?: boolean): BufferCodec;
    uint16(value: number, littleEndian?: boolean): BufferCodec;
    int32(value: number, littleEndian?: boolean): BufferCodec;
    uint32(value: number, littleEndian?: boolean): BufferCodec;
    float32(value: number, littleEndian?: boolean): BufferCodec;
    float64(value: number, littleEndian?: boolean): BufferCodec;
    private parseObject;
    private parseArray;
    private parseValue;
    private decodeString;
    private encodeString;
    private encodeValue;
}
