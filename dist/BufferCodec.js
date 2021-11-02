"use strict";
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _BufferCodec_buffer, _BufferCodec_dataView, _BufferCodec_encoding, _BufferCodec_offset, _BufferCodec_jobs;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferCodec = void 0;
const BufferStrategy_1 = require("./BufferStrategy");
class BufferCodec {
    /**
     * Creates a new instance of BufferCodec
     * @param options Options for buffer codec
     */
    constructor(options = {
        encoding: 'utf16'
    }) {
        _BufferCodec_buffer.set(this, void 0);
        _BufferCodec_dataView.set(this, void 0);
        _BufferCodec_encoding.set(this, 'utf16');
        _BufferCodec_offset.set(this, 0);
        _BufferCodec_jobs.set(this, []);
        if (options.encoding) {
            this.setEncoding(options.encoding);
        }
        if (options.buffer) {
            __classPrivateFieldSet(this, _BufferCodec_buffer, options.buffer, "f");
            __classPrivateFieldSet(this, _BufferCodec_dataView, new DataView(__classPrivateFieldGet(this, _BufferCodec_buffer, "f")), "f");
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
        return __classPrivateFieldGet(this, _BufferCodec_offset, "f");
    }
    /**
     * @returns {ArrayBuffer} Current buffer
     */
    get buffer() {
        if (__classPrivateFieldGet(this, _BufferCodec_buffer, "f")) {
            return __classPrivateFieldGet(this, _BufferCodec_buffer, "f");
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
        __classPrivateFieldSet(this, _BufferCodec_encoding, encoding, "f");
        return this;
    }
    /**
     * Encode all queued values and return resulting buffer
     * @returns {ArrayBuffer} Encoded buffer
     */
    result() {
        __classPrivateFieldSet(this, _BufferCodec_offset, 0, "f");
        const bufferLength = __classPrivateFieldGet(this, _BufferCodec_jobs, "f").reduce((last, current) => last + current.length, 0);
        const buffer = new ArrayBuffer(bufferLength);
        const dataView = new DataView(buffer);
        if (__classPrivateFieldGet(this, _BufferCodec_jobs, "f").length > 0) {
            __classPrivateFieldGet(this, _BufferCodec_jobs, "f").forEach(job => {
                switch (job.type) {
                    case 'string':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeString(dataView, job), "f");
                        break;
                    case 'float32':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeValue(dataView, dataView.setFloat32, job), "f");
                        break;
                    case 'float64':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeValue(dataView, dataView.setFloat64, job), "f");
                        break;
                    case 'int8':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeValue(dataView, dataView.setInt8, job), "f");
                        break;
                    case 'int16':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeValue(dataView, dataView.setInt16, job), "f");
                        break;
                    case 'int32':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeValue(dataView, dataView.setInt32, job), "f");
                        break;
                    case 'uint8':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeValue(dataView, dataView.setUint8, job), "f");
                        break;
                    case 'uint16':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeValue(dataView, dataView.setUint16, job), "f");
                        break;
                    case 'uint32':
                        __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + this.encodeValue(dataView, dataView.setUint32, job), "f");
                        break;
                    default:
                        throw new Error(`Unrecognized type '${job.type}'`);
                }
            });
        }
        __classPrivateFieldSet(this, _BufferCodec_jobs, [], "f");
        return dataView.buffer;
    }
    /**
     * Decode a single value from current offset
     * @param options {BufferTypeOptions} Value decoding options
     * @returns Decoded value
     */
    decode(options) {
        const dataView = __classPrivateFieldGet(this, _BufferCodec_dataView, "f");
        let itemValue;
        switch (options.type) {
            case 'int8':
                itemValue = dataView.getInt8(__classPrivateFieldGet(this, _BufferCodec_offset, "f"));
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + 1, "f");
                break;
            case 'uint8':
                itemValue = dataView.getUint8(__classPrivateFieldGet(this, _BufferCodec_offset, "f"));
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + 1, "f");
                break;
            case 'int16':
                itemValue = dataView.getInt16(__classPrivateFieldGet(this, _BufferCodec_offset, "f"), options.littleEndian);
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + 2, "f");
                break;
            case 'uint16':
                itemValue = dataView.getUint16(__classPrivateFieldGet(this, _BufferCodec_offset, "f"), options.littleEndian);
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + 2, "f");
                break;
            case 'int32':
                itemValue = dataView.getInt32(__classPrivateFieldGet(this, _BufferCodec_offset, "f"), options.littleEndian);
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + 4, "f");
                break;
            case 'uint32':
                itemValue = dataView.getUint32(__classPrivateFieldGet(this, _BufferCodec_offset, "f"), options.littleEndian);
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + 4, "f");
                break;
            case 'float32':
                itemValue = dataView.getFloat32(__classPrivateFieldGet(this, _BufferCodec_offset, "f"), options.littleEndian);
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + 4, "f");
                break;
            case 'float64':
                itemValue = dataView.getFloat64(__classPrivateFieldGet(this, _BufferCodec_offset, "f"), options.littleEndian);
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + 8, "f");
                break;
            case 'string':
                const [decodedString, length] = this.decodeString(dataView, options.encoding || __classPrivateFieldGet(this, _BufferCodec_encoding, "f"));
                itemValue = decodedString;
                __classPrivateFieldSet(this, _BufferCodec_offset, __classPrivateFieldGet(this, _BufferCodec_offset, "f") + length, "f");
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
    string(value, encoding = __classPrivateFieldGet(this, _BufferCodec_encoding, "f")) {
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
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
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
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
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
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
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
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
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
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
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
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
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
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
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
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
        __classPrivateFieldGet(this, _BufferCodec_jobs, "f").push({
            value,
            type: 'float64',
            length: 8,
            littleEndian
        });
        return this;
    }
    decodeString(dataView, encoding) {
        let currentOffset = __classPrivateFieldGet(this, _BufferCodec_offset, "f");
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
        return [result, currentOffset - __classPrivateFieldGet(this, _BufferCodec_offset, "f")];
    }
    encodeString(dataView, job) {
        const value = job.value;
        const valueLength = value.length;
        let currentOffset = __classPrivateFieldGet(this, _BufferCodec_offset, "f");
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
                throw new Error(`Undefined encoding provided '${__classPrivateFieldGet(this, _BufferCodec_encoding, "f")}'`);
        }
        return currentOffset - __classPrivateFieldGet(this, _BufferCodec_offset, "f");
    }
    encodeValue(dataView, fn, job) {
        fn.call(dataView, __classPrivateFieldGet(this, _BufferCodec_offset, "f"), job.value, job.littleEndian);
        return job.length;
    }
}
exports.BufferCodec = BufferCodec;
_BufferCodec_buffer = new WeakMap(), _BufferCodec_dataView = new WeakMap(), _BufferCodec_encoding = new WeakMap(), _BufferCodec_offset = new WeakMap(), _BufferCodec_jobs = new WeakMap();
