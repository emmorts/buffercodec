"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const BufferStrategy_1 = require("../BufferStrategy");
class ObjectStrategy {
    static supports(template) {
        return Object.prototype.toString.call(template) === '[object Object]' && template != null;
    }
    static encode(value, template, codec) {
        const objectTemplate = template;
        for (const propertyName in objectTemplate) {
            BufferStrategy_1.BufferStrategy.encode(value[propertyName], objectTemplate[propertyName], codec);
        }
    }
    static decode(template, codec) {
        const objectTemplate = template;
        const result = {};
        for (const propertyName in objectTemplate) {
            const decodedValue = BufferStrategy_1.BufferStrategy.decode(objectTemplate[propertyName], codec);
            result[propertyName] = decodedValue;
        }
        return result;
    }
}
exports.default = ObjectStrategy;
