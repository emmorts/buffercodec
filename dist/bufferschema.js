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
var _template, _encoding, _transform;
Object.defineProperty(exports, "__esModule", { value: true });
const buffercodec_1 = require("./buffercodec");
class BufferSchema {
    constructor(template, options = { encoding: 'utf16' }) {
        _template.set(this, void 0);
        _encoding.set(this, 'utf16');
        _transform.set(this, void 0);
        __classPrivateFieldSet(this, _template, template);
        if (options.encoding) {
            __classPrivateFieldSet(this, _encoding, options.encoding);
        }
        if (options.transform) {
            __classPrivateFieldSet(this, _transform, options.transform);
        }
    }
    encode(object, codec) {
        if (!codec) {
            codec = new buffercodec_1.BufferCodec({
                encoding: __classPrivateFieldGet(this, _encoding)
            });
        }
        if (object && __classPrivateFieldGet(this, _template)) {
            this.encodeObject(codec, object, __classPrivateFieldGet(this, _template));
        }
        return codec.result();
    }
    decode(buffer) {
        return buffercodec_1.BufferCodec
            .from(buffer)
            .setEncoding(__classPrivateFieldGet(this, _encoding))
            .parse(__classPrivateFieldGet(this, _template), __classPrivateFieldGet(this, _transform));
    }
    encodeObject(workCodec, object, template) {
        // TODO: exists? nullable?
        if (typeof (template) === 'string') {
            const valueType = template;
            this.encodeValue(workCodec, object, valueType);
            return;
        }
        if (template instanceof Array) {
            this.encodeArray(workCodec, object, template[0]);
            return;
        }
        const valueObject = template;
        if (valueObject) {
            for (const propertyName in template) {
                const propertyTemplate = valueObject[propertyName];
                this.encodeObject(workCodec, object[propertyName], propertyTemplate);
            }
            return;
        }
    }
    encodeArray(workCodec, values, template) {
        const arrayLength = values.length;
        workCodec.uint8(arrayLength);
        values.forEach(value => {
            this.encodeObject(workCodec, value, template);
        });
    }
    encodeValue(workCodec, value, type) {
        switch (type) {
            case 'int8':
                workCodec.int8(value);
                break;
            case 'uint8':
                workCodec.uint8(value);
                break;
            case 'int16le':
                workCodec.int16(value, true);
                break;
            case 'uint16le':
                workCodec.uint16(value, true);
                break;
            case 'int16be':
                workCodec.int16(value);
                break;
            case 'uint16be':
                workCodec.uint16(value);
                break;
            case 'int32le':
                workCodec.int32(value, true);
                break;
            case 'uint32le':
                workCodec.uint32(value, true);
                break;
            case 'int32be':
                workCodec.int32(value);
                break;
            case 'uint32be':
                workCodec.uint32(value);
                break;
            case 'float32le':
                workCodec.float32(value, true);
                break;
            case 'float32be':
                workCodec.float32(value);
                break;
            case 'float64le':
                workCodec.float64(value, true);
                break;
            case 'float64be':
                workCodec.float64(value);
                break;
            case 'string':
                workCodec.string(value);
                break;
        }
    }
}
exports.BufferSchema = BufferSchema;
_template = new WeakMap(), _encoding = new WeakMap(), _transform = new WeakMap();
