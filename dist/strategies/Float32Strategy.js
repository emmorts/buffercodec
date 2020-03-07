"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BufferStrategy_1 = require("../BufferStrategy");
class Float32Strategy {
    static supports(template) {
        if (typeof (template) !== 'string') {
            return false;
        }
        const typeOptions = BufferStrategy_1.BufferStrategy.getTypeOptions(template);
        return typeOptions.type === 'float32';
    }
    static encode(value, template) {
        const typeOptions = BufferStrategy_1.BufferStrategy.getTypeOptions(template);
        return [Object.assign({ value }, {
                type: typeOptions.type,
                littleEndian: typeOptions.littleEndian,
                nullable: typeOptions.nullable
            })];
    }
    static decode(template, codec) {
        return codec.decode(BufferStrategy_1.BufferStrategy.getTypeOptions(template));
    }
}
exports.default = Float32Strategy;
