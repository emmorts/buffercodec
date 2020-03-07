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
class BufferCodec {
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
    get offset() {
        return __classPrivateFieldGet(this, _offset);
    }
    set offset(value) {
        __classPrivateFieldSet(this, _offset, value);
    }
    setEncoding(encoding) {
        if (encoding !== 'utf16' && encoding !== 'utf8') {
            throw new Error(`Unsupported encoding '${encoding}'. Only UTF-8 and UTF-16 are currently supported.`);
        }
        __classPrivateFieldSet(this, _encoding, encoding);
        return this;
    }
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
    getBuffer(trimOffset = false) {
        if (__classPrivateFieldGet(this, _buffer)) {
            if (trimOffset) {
                return __classPrivateFieldGet(this, _buffer).slice(__classPrivateFieldGet(this, _offset));
            }
            return __classPrivateFieldGet(this, _buffer);
        }
        return new ArrayBuffer(0);
    }
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
                const [decodedString, length] = this.decodeString(dataView);
                itemValue = decodedString;
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + length);
                break;
            default:
                throw new Error(`Type '${options.type}' is not supported.`);
        }
        return itemValue;
    }
    parse(template, transform) {
        if (__classPrivateFieldGet(this, _buffer) && template) {
            const dataView = __classPrivateFieldGet(this, _dataView);
            let result = {};
            if (typeof (template) === 'string') {
                result = this.parseValue(dataView, template);
            }
            else if (template instanceof Array) {
                const arrayTemplate = template;
                result = this.parseArray(dataView, arrayTemplate[0]);
            }
            else {
                const objectTemplate = template;
                result = this.parseObject(dataView, objectTemplate);
            }
            if (transform) {
                return transform(result);
            }
            else {
                return result;
            }
        }
    }
    string(value) {
        __classPrivateFieldGet(this, _jobs).push({
            type: 'string',
            length: (__classPrivateFieldGet(this, _encoding) === 'utf16' ? value.length * 2 : value.length) + 1,
            value
        });
        return this;
    }
    int8(value) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'int8',
            length: 1
        });
        return this;
    }
    uint8(value) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'uint8',
            length: 1
        });
        return this;
    }
    int16(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'int16',
            length: 2,
            littleEndian
        });
        return this;
    }
    uint16(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'uint16',
            length: 2,
            littleEndian
        });
        return this;
    }
    int32(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'int32',
            length: 4,
            littleEndian
        });
        return this;
    }
    uint32(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'uint32',
            length: 4,
            littleEndian
        });
        return this;
    }
    float32(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'float32',
            length: 4,
            littleEndian
        });
        return this;
    }
    float64(value, littleEndian = false) {
        __classPrivateFieldGet(this, _jobs).push({
            value,
            type: 'float64',
            length: 8,
            littleEndian
        });
        return this;
    }
    parseObject(dataView, template) {
        const result = {};
        for (const propertyName in template) {
            if (typeof (template[propertyName]) === 'string') {
                const valueType = template[propertyName];
                result[propertyName] = this.parseValue(dataView, valueType);
                continue;
            }
            if (template[propertyName] instanceof Array) {
                const valueArray = template[propertyName];
                result[propertyName] = this.parseArray(dataView, valueArray[0]);
                continue;
            }
            const valueObject = template[propertyName];
            if (valueObject) {
                result[propertyName] = this.parseObject(dataView, valueObject);
                continue;
            }
        }
        return result;
    }
    parseArray(dataView, template) {
        var _a;
        const result = [];
        const length = dataView.getUint8((__classPrivateFieldSet(this, _offset, (_a = +__classPrivateFieldGet(this, _offset)) + 1), _a));
        if (length > 0) {
            for (let i = 0; i < length; i++) {
                result.push(this.parse(template));
            }
        }
        return result;
    }
    parseValue(dataView, type) {
        let itemValue;
        switch (type) {
            case 'int8':
                itemValue = dataView.getInt8(__classPrivateFieldGet(this, _offset));
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 1);
                break;
            case 'uint8':
                itemValue = dataView.getUint8(__classPrivateFieldGet(this, _offset));
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 1);
                break;
            case 'int16le':
                itemValue = dataView.getInt16(__classPrivateFieldGet(this, _offset), true);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 2);
                break;
            case 'uint16le':
                itemValue = dataView.getUint16(__classPrivateFieldGet(this, _offset), true);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 2);
                break;
            case 'int16be':
                itemValue = dataView.getInt16(__classPrivateFieldGet(this, _offset), false);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 2);
                break;
            case 'uint16be':
                itemValue = dataView.getUint16(__classPrivateFieldGet(this, _offset), false);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 2);
                break;
            case 'int32le':
                itemValue = dataView.getInt32(__classPrivateFieldGet(this, _offset), true);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'uint32le':
                itemValue = dataView.getUint32(__classPrivateFieldGet(this, _offset), true);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'int32be':
                itemValue = dataView.getInt32(__classPrivateFieldGet(this, _offset), false);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'uint32be':
                itemValue = dataView.getUint32(__classPrivateFieldGet(this, _offset), false);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'float32le':
                itemValue = dataView.getFloat32(__classPrivateFieldGet(this, _offset), true);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'float32be':
                itemValue = dataView.getFloat32(__classPrivateFieldGet(this, _offset), false);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 4);
                break;
            case 'float64le':
                itemValue = dataView.getFloat64(__classPrivateFieldGet(this, _offset), true);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 8);
                break;
            case 'float64be':
                itemValue = dataView.getFloat64(__classPrivateFieldGet(this, _offset), false);
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + 8);
                break;
            case 'string':
                const [decodedString, length] = this.decodeString(dataView);
                itemValue = decodedString;
                __classPrivateFieldSet(this, _offset, __classPrivateFieldGet(this, _offset) + length);
                break;
            default:
                throw new Error(`Type '${type}' is not supported.`);
        }
        return itemValue;
    }
    decodeString(dataView) {
        let currentOffset = __classPrivateFieldGet(this, _offset);
        let result = '';
        const contentLength = dataView.getUint8(currentOffset++);
        if (__classPrivateFieldGet(this, _encoding) === 'utf16') {
            const utf16 = new ArrayBuffer(contentLength * 2);
            const utf16view = new Uint16Array(utf16);
            for (let i = 0; i < contentLength; i++, currentOffset += 2) {
                utf16view[i] = dataView.getUint8(currentOffset);
            }
            result = String.fromCharCode.apply(null, Array.from(utf16view));
        }
        if (__classPrivateFieldGet(this, _encoding) === 'utf8') {
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
        switch (__classPrivateFieldGet(this, _encoding)) {
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
