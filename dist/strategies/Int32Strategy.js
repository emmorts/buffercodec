"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BufferStrategy_1 = require("../BufferStrategy");
class Int32Strategy {
    supports(template) {
        if (typeof (template) !== 'string') {
            return false;
        }
        const typeOptions = BufferStrategy_1.BufferStrategy.getTypeOptions(template);
        return typeOptions.type === 'int32';
    }
    encode(value, template, codec) {
        const typeOptions = BufferStrategy_1.BufferStrategy.getTypeOptions(template);
        if (typeOptions.nullable) {
            const valueIsNull = value === undefined || value === null;
            if (valueIsNull) {
                codec.uint8(1);
            }
            else {
                codec.uint8(0);
                codec.int32(value, typeOptions.littleEndian);
            }
        }
        else {
            codec.int32(value, typeOptions.littleEndian);
        }
    }
    decode(template, codec) {
        const typeOptions = BufferStrategy_1.BufferStrategy.getTypeOptions(template);
        if (typeOptions.nullable) {
            const valueIsNull = codec.decode({ type: 'uint8' });
            if (valueIsNull) {
                return null;
            }
        }
        return codec.decode(typeOptions);
    }
}
exports.default = Int32Strategy;
