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
var _template;
Object.defineProperty(exports, "__esModule", { value: true });
const BufferCodec_1 = require("./BufferCodec");
const BufferStrategy_1 = require("./BufferStrategy");
class BufferSchema {
    constructor(template) {
        _template.set(this, void 0);
        __classPrivateFieldSet(this, _template, template);
    }
    /**
     * Encodes object
     * @param value {any} Object to encode
     * @returns {ArrayBuffer} Buffer containing encoded buffer
     */
    encode(value) {
        const bufferCodec = new BufferCodec_1.BufferCodec();
        BufferStrategy_1.BufferStrategy.encode(value, __classPrivateFieldGet(this, _template), bufferCodec);
        return bufferCodec.result();
    }
    /**
     * Decodes object
     * @param {ArrayBuffer} buffer Buffer containing encoded object
     * @returns {any} Decoded object
     */
    decode(buffer) {
        const workCodec = BufferCodec_1.BufferCodec.from(buffer);
        return BufferStrategy_1.BufferStrategy.decode(__classPrivateFieldGet(this, _template), workCodec);
    }
}
exports.BufferSchema = BufferSchema;
_template = new WeakMap();
