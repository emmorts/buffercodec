import { BufferCodec, BufferTemplate, BufferStringEncoding } from './buffercodec';
export interface BufferSchemaOptions {
    encoding?: BufferStringEncoding;
    transform?: (result: any) => any;
}
export declare class BufferSchema {
    #private;
    constructor(template: BufferTemplate, options?: BufferSchemaOptions);
    encode(object: any, codec?: BufferCodec): ArrayBuffer;
    decode(buffer: ArrayBuffer): any;
    private encodeObject;
    private encodeArray;
    private encodeValue;
}
