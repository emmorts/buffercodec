"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BufferStrategy_1 = require("../BufferStrategy");
class UInt16Strategy {
    static supports(template) {
        if (typeof (template) !== 'string') {
            return false;
        }
        const typeOptions = BufferStrategy_1.BufferStrategy.getTypeOptions(template);
        return typeOptions.type === 'uint16';
    }
    static encode(value, template, codec) {
        const typeOptions = BufferStrategy_1.BufferStrategy.getTypeOptions(template);
        codec.uint16(value, typeOptions.littleEndian);
    }
    static decode(template, codec) {
        return codec.decode(BufferStrategy_1.BufferStrategy.getTypeOptions(template));
    }
}
exports.default = UInt16Strategy;
