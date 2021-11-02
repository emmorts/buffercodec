/// <reference types="node" />
import { BufferStringEncoding, BufferTypeOptions, BufferTemplate } from "./Buffer.types";
export interface BufferCodecConstructorOptions {
    buffer?: ArrayBuffer;
    encoding?: BufferStringEncoding;
}
export declare class BufferCodec {
    #private;
    /**
     * Creates a new instance of BufferCodec
     * @param options Options for buffer codec
     */
    constructor(options?: BufferCodecConstructorOptions);
    /**
     * Creates a new BufferCodec instance from given buffer
     * @param {Buffer | ArrayBuffer} buffer Either ArrayBuffer or Buffer
     * @returns {BufferCodec} A new instance of BufferCodec
     */
    static from(buffer: Buffer | ArrayBuffer): BufferCodec;
    /**
     * @returns {number} Current offset of the buffer
     */
    get offset(): number;
    /**
     * @returns {ArrayBuffer} Current buffer
     */
    get buffer(): ArrayBuffer;
    /**
     * Sets string encoding
     * @param encoding {BufferStringEncoding} String encoding (either 'utf8' or 'utf16')
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    setEncoding(encoding: BufferStringEncoding): BufferCodec;
    /**
     * Encode all queued values and return resulting buffer
     * @returns {ArrayBuffer} Encoded buffer
     */
    result(): ArrayBuffer;
    /**
     * Decode a single value from current offset
     * @param options {BufferTypeOptions} Value decoding options
     * @returns Decoded value
     */
    decode(options: BufferTypeOptions): any;
    /**
     * Decode the whole buffer using provided template
     * @param template {BufferTemplate | BufferTemplate[]} Template to use for buffer decoding
     * @returns {any} Decoded object
     */
    parse(template: BufferTemplate | BufferTemplate[]): any;
    /**
     * Encodes a string value
     * @param value {string} String to encode
     * @param encoding {BufferStringEncoding} String encoding (either 'utf8' or 'utf16'). This parameter takes precedence over the general encoding property set on BufferCodec instance
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    string(value: string, encoding?: BufferStringEncoding): BufferCodec;
    /**
     * Encode a signed 8-bit number
     * @param value 8-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    int8(value: number): BufferCodec;
    /**
     * Encode an unsigned 8-bit number
     * @param value 8-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    uint8(value: number): BufferCodec;
    /**
     * Encode a signed 16-bit number
     * @param value 16-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    int16(value: number, littleEndian?: boolean): BufferCodec;
    /**
     * Encode an unsigned 16-bit number
     * @param value 16-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    uint16(value: number, littleEndian?: boolean): BufferCodec;
    /**
     * Encode a signed 32-bit number
     * @param value 32-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    int32(value: number, littleEndian?: boolean): BufferCodec;
    /**
     * Encode an unsigned 32-bit number
     * @param value 32-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    uint32(value: number, littleEndian?: boolean): BufferCodec;
    /**
     * Encode a 32-bit float
     * @param value 32-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    float32(value: number, littleEndian?: boolean): BufferCodec;
    /**
     * Encode a 64-bit float
     * @param value 64-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    float64(value: number, littleEndian?: boolean): BufferCodec;
    private decodeString;
    private encodeString;
    private encodeValue;
}
