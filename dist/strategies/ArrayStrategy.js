"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BufferStrategy_1 = require("../BufferStrategy");
class ArrayStrategy {
    static supports(template) {
        return template instanceof Array;
    }
    static encode(value, template, codec) {
        const innerTemplate = template[0];
        const values = value;
        codec.uint8(values.length);
        values.forEach(val => BufferStrategy_1.BufferStrategy.encode(val, innerTemplate, codec));
    }
    static decode(template, codec) {
        const innerTemplate = template[0];
        const arrayLength = codec.decode({ type: 'uint8' });
        const result = [];
        for (let i = 0; i < arrayLength; i++) {
            result.push(BufferStrategy_1.BufferStrategy.decode(innerTemplate, codec));
        }
        return result;
    }
}
exports.default = ArrayStrategy;
