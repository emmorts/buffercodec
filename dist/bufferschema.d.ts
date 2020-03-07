import { BufferCodec, BufferTemplate } from './BufferCodec';
export declare class BufferSchema {
    #private;
    constructor(template: BufferTemplate);
    encode(value: any, bufferCodec?: BufferCodec): ArrayBuffer;
    decode(buffer: ArrayBuffer): any;
    private executeEncodeJob;
    private encodeValue;
}
