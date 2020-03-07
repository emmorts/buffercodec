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
    encode(value, bufferCodec = new BufferCodec_1.BufferCodec()) {
        const encodeJobs = BufferStrategy_1.BufferStrategy.getEncodeJobs(value, __classPrivateFieldGet(this, _template));
        if (encodeJobs && encodeJobs.length) {
            encodeJobs.forEach(job => this.executeEncodeJob(job, bufferCodec));
        }
        return bufferCodec.result();
    }
    decode(buffer) {
        const workCodec = BufferCodec_1.BufferCodec.from(buffer);
        const strategy = BufferStrategy_1.BufferStrategy.getTemplateStrategy(__classPrivateFieldGet(this, _template));
        return strategy.decode(__classPrivateFieldGet(this, _template), workCodec);
    }
    executeEncodeJob(encodeJob, workCodec) {
        this.encodeValue(workCodec, encodeJob.value, encodeJob.type, encodeJob.littleEndian);
    }
    encodeValue(workCodec, value, type, littleEndian = false) {
        switch (type) {
            case 'int8':
                workCodec.int8(value);
                break;
            case 'uint8':
                workCodec.uint8(value);
                break;
            case 'int16':
                workCodec.int16(value, littleEndian);
                break;
            case 'uint16':
                workCodec.uint16(value, littleEndian);
                break;
            case 'int32':
                workCodec.int32(value, littleEndian);
                break;
            case 'uint32':
                workCodec.uint32(value, littleEndian);
                break;
            case 'float32':
                workCodec.float32(value, littleEndian);
                break;
            case 'float64':
                workCodec.float64(value, littleEndian);
                break;
            case 'string':
                workCodec.string(value);
                break;
        }
    }
}
exports.BufferSchema = BufferSchema;
_template = new WeakMap();
