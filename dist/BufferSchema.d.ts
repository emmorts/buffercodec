import { BufferTemplate } from './buffer.types';
export declare class BufferSchema {
    #private;
    constructor(template: BufferTemplate);
    /**
     * Encodes object
     * @param value {any} Object to encode
     * @returns {ArrayBuffer} Buffer containing encoded buffer
     */
    encode(value: any): ArrayBuffer;
    /**
     * Decodes object
     * @param {ArrayBuffer} buffer Buffer containing encoded object
     * @returns {any} Decoded object
     */
    decode(buffer: ArrayBuffer): any;
}
