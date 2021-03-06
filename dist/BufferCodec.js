"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, privateMap, value) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to set private field on non-instance");
    }
    privateMap.set(receiver, value);
    return value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, privateMap) {
    if (!privateMap.has(receiver)) {
        throw new TypeError("attempted to get private field on non-instance");
    }
    return privateMap.get(receiver);
};
var _buffer, _dataView, _encoding, _offset, _jobs;
Object.defineProperty(exports, "__esModule", { value: true });
const BufferStrategy_1 = require("./BufferStrategy");
class BufferCodec {
    /**
     * Creates a new instance of BufferCodec
     * @param options Options for buffer codec
     */
    constructor(options = {
        encoding: 'utf16'
    }) {
        _buffer.set(this, void 0);
        _dataView.set(this, void 0);
        _encoding.set(this, 'utf16');
        _offset.set(this, 0);
        _jobs.set(this, []);
        if (options.encoding) {
            this.setEncoding(options.encoding);
        }
        if (options.buffer) {
            __classPrivateFieldSet(this, _buffer, options.buffer);
            __classPrivateFieldSet(this, _dataView, new DataView(__classPrivateFieldGet(this, _buffer)));
        }
    }
    /**
     * Creates a new BufferCodec instance from given buffer
     * @param {Buffer | ArrayBuffer} buffer Either ArrayBuffer or Buffer
     * @returns {BufferCodec} A new instance of BufferCodec
     */
    static from(buffer) {
        if (buffer && buffer.byteLength > 0) {
            if (buffer instanceof ArrayBuffer) {
                return new BufferCodec({ buffer });
            }
            else {
                const arrayBuffer = new ArrayBuffer(buffer.length);
                const view = new Uint8Array(arrayBuffer);
                for (let i = 0; i < buffer.length; ++i) {
                    view[i] = buffer[i];
                }
                return new BufferCodec({ buffer: arrayBuffer });
            }
        }
        else {
            throw new Error("Received malformed data.");
        }
    }
    /**
     * @returns {number} Current offset of the buffer
     */
    get offset() {
        return __classPrivateFieldGet(this, _offset);
    }
    /**
     * @returns {ArrayBuffer} Current buffer
     */
    get buffer() {
        if (__classPrivateFieldGet(this, _buffer)) {
            return __classPrivateFieldGet(this, _buffer);
        }
        return new ArrayBuffer(0);
    }
    /**
     * Sets string encoding
     * @param encoding {BufferStringEncoding} String encoding (either 'utf8' or 'utf16')
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    setEncoding(encoding) {
        if (encoding !== 'utf16' && encoding !== 'utf8') {
            throw new Error(`Unsupported encoding '${encoding}'. Only UTF-8 and UTF-16 are currently supported.`);
        }
        __classPrivateFieldSet(this, _encoding, encoding);
        return this;
    }
    /**
     * Encode all queued values and return resulting buffer
     * @returns {ArrayBuffer} Encoded buffer
     */
    result() {
        __classPrivateFieldSet(this, _offset, 0);
        const bufferLength = __classPrivateFieldGet(this, _jobs).reduce((last, current) => last + current.length, 0);
        const buffer = new ArrayBuffer(bufferLength);
        const dataView = new DataView(buffer);
        if (__classPrivateFieldGet(this, _jobs).length > 0) {
            __classPrivateFieldGet(this, _jobs).forEach(job => {
                switch (job.type) {
                    case 'string':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeString(dataView, job));
                        break;
                    case 'float32':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeValue(dataView, dataView.setFloat32, job));
                        break;
                    case 'float64':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeValue(dataView, dataView.setFloat64, job));
                        break;
                    case 'int8':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeValue(dataView, dataView.setInt8, job));
                        break;
                    case 'int16':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeValue(dataView, dataView.setInt16, job));
                        break;
                    case 'int32':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeValue(dataView, dataView.setInt32, job));
                        break;
                    case 'uint8':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeValue(dataView, dataView.setUint8, job));
                        break;
                    case 'uint16':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeValue(dataView, dataView.setUint16, job));
                        break;
                    case 'uint32':
                        __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + this.encodeValue(dataView, dataView.setUint32, job));
                        break;
                    default:
                        throw new Error(`Unrecognized type '${job.type}'`);
                }
            });
        }
        __classPrivateFieldSet(this, _jobs, []);
        return dataView.buffer;
    }
    /**
     * Decode a single value from current offset
     * @param options {BufferTypeOptions} Value decoding options
     * @returns Decoded value
     */
    decode(options) {
        const dataView = __classPrivateFieldGet(this, _dataView);
        let itemValue;
        switch (options.type) {
            case 'int8':
                itemValue = dataView.getInt8(__classPrivateFieldGet(this, _offset));
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 1);
                break;
            case 'uint8':
                itemValue = dataView.getUint8(__classPrivateFieldGet(this, _offset));
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 1);
                break;
            case 'int16':
                itemValue = dataView.getInt16(__classPrivateFieldGet(this, _offset), options.littleEndian);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 2);
                break;
            case 'uint16':
                itemValue = dataView.getUint16(__classPrivateFieldGet(this, _offset), options.littleEndian);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 2);
                break;
            case 'int32':
                itemValue = dataView.getInt32(__classPrivateFieldGet(this, _offset), options.littleEndian);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'uint32':
                itemValue = dataView.getUint32(__classPrivateFieldGet(this, _offset), options.littleEndian);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'float32':
                itemValue = dataView.getFloat32(__classPrivateFieldGet(this, _offset), options.littleEndian);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'float64':
                itemValue = dataView.getFloat64(__classPrivateFieldGet(this, _offset), options.littleEndian);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 8);
                break;
            case 'string':
                const [decodedString, length] = this.decodeString(dataView, options.encoding || __classPrivateFieldGet(this, _encoding));
                itemValue = decodedString;
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + length);
                break;
            default:
                throw new Error(`Type '${options.type}' is not supported.`);
        }
        return itemValue;
    }
    /**
     * Decode the whole buffer using provided template
     * @param template {BufferTemplate | BufferTemplate[]} Template to use for buffer decoding
     * @returns {any} Decoded object
     */
    parse(template) {
        return BufferStrategy_1.BufferStrategy.decode(template, this);
    }
    /**
     * Encodes a string value
     * @param value {string} String to encode
     * @param encoding {BufferStringEncoding} String encoding (either 'utf8' or 'utf16'). This parameter takes precedence over the general encoding property set on BufferCodec instance
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    string(value, encoding = __classPrivateFieldGet(this, _encoding)) {
        __classPrivateFieldGet(this, _jobs).push({
            type: 'string',
            length: (encoding === 'utf16' ? value.length * 2 : value.length) + 1,
            encoding: encoding,
            value
        });
        return this;
    }
    /**
     * Encode a signed 8-bit number
     * @param value 8-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    int8(value) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'int8',
            length: 1
        });
        return this;
    }
    /**
     * Encode an unsigned 8-bit number
     * @param value 8-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    uint8(value) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'uint8',
            length: 1
        });
        return this;
    }
    /**
     * Encode a signed 16-bit number
     * @param value 16-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    int16(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'int16',
            length: 2,
            littleEndian
        });
        return this;
    }
    /**
     * Encode an unsigned 16-bit number
     * @param value 16-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    uint16(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'uint16',
            length: 2,
            littleEndian
        });
        return this;
    }
    /**
     * Encode a signed 32-bit number
     * @param value 32-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    int32(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'int32',
            length: 4,
            littleEndian
        });
        return this;
    }
    /**
     * Encode an unsigned 32-bit number
     * @param value 32-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    uint32(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'uint32',
            length: 4,
            littleEndian
        });
        return this;
    }
    /**
     * Encode a 32-bit float
     * @param value 32-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    float32(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'float32',
            length: 4,
            littleEndian
        });
        return this;
    }
    /**
     * Encode a 64-bit float
     * @param value 64-bit numeric value
     * @returns {BufferCodec} Current instance of BufferCodec
     */
    float64(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'float64',
            length: 8,
            littleEndian
        });
        return this;
    }
    decodeString(dataView, encoding) {
        let currentOffset = __classPrivateFieldGet(this, _offset);
        let result = '';
        const contentLength = dataView.getUint8(currentOffset++);
        if (encoding === 'utf16') {
            const utf16 = new ArrayBuffer(contentLength * 2);
            const utf16view = new Uint16Array(utf16);
            for (let i = 0; i < contentLength; i++, currentOffset += 2) {
                utf16view[i] = dataView.getUint8(currentOffset);
            }
            result = String.fromCharCode.apply(null, Array.from(utf16view));
        }
        if (encoding === 'utf8') {
            const utf8 = new ArrayBuffer(contentLength);
            const utf8view = new Uint8Array(utf8);
            for (let i = 0; i < contentLength; i++, currentOffset += 1) {
                utf8view[i] = dataView.getUint8(currentOffset);
            }
            result = String.fromCharCode.apply(null, Array.from(utf8view));
        }
        return [result, currentOffset - __classPrivateFieldGet(this, _offset)];
    }
    encodeString(dataView, job) {
        const value = job.value;
        const valueLength = value.length;
        let currentOffset = __classPrivateFieldGet(this, _offset);
        dataView.setUint8(currentOffset++, valueLength);
        switch (job.encoding) {
            case 'utf16':
                for (let i = 0; i < (job.length - 1) / 2; i++, currentOffset += 2) {
                    dataView.setUint16(currentOffset, value.charCodeAt(i), true);
                }
                break;
            case 'utf8':
                for (let i = 0; i < (job.length - 1); i++, currentOffset++) {
                    dataView.setUint8(currentOffset, value.charCodeAt(i));
                }
                break;
            default:
                throw new Error(`Undefined encoding provided '${__classPrivateFieldGet(this, _encoding)}'`);
        }
        return currentOffset - __classPrivateFieldGet(this, _offset);
    }
    encodeValue(dataView, fn, job) {
        fn.call(dataView, __classPrivateFieldGet(this, _offset), job.value, job.littleEndian);
        return job.length;
    }
}
exports.BufferCodec = BufferCodec;
_buffer = new WeakMap(), _dataView = new WeakMap(), _encoding = new WeakMap(), _offset = new WeakMap(), _jobs = new WeakMap();
