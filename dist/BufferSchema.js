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
var _BufferSchema_template;
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferSchema = void 0;
const BufferCodec_1 = require("./BufferCodec");
const BufferStrategy_1 = require("./BufferStrategy");
class BufferSchema {
    constructor(template) {
        _BufferSchema_template.set(this, void 0);
        __classPrivateFieldSet(this, _BufferSchema_template, template, "f");
    }
    /**
     * Encodes object
     * @param value {any} Object to encode
     * @returns {ArrayBuffer} Buffer containing encoded buffer
     */
    encode(value) {
        const bufferCodec = new BufferCodec_1.BufferCodec();
        BufferStrategy_1.BufferStrategy.encode(value, __classPrivateFieldGet(this, _BufferSchema_template, "f"), bufferCodec);
        return bufferCodec.result();
    }
    /**
     * Decodes object
     * @param {ArrayBuffer} buffer Buffer containing encoded object
     * @returns {any} Decoded object
     */
    decode(buffer) {
        const workCodec = BufferCodec_1.BufferCodec.from(buffer);
        return BufferStrategy_1.BufferStrategy.decode(__classPrivateFieldGet(this, _BufferSchema_template, "f"), workCodec);
    }
}
exports.BufferSchema = BufferSchema;
_BufferSchema_template = new WeakMap();
