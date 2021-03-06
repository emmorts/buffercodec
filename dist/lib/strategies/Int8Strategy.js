"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Int8Strategy {
    static supports(template) {
        return typeof (template) === 'string' && template === 'int8';
    }
    static encode(value, template, codec) {
        codec.int8(value);
    }
    static decode(template, codec) {
        return codec.decode({ type: 'int8' });
    }
}
exports.default = Int8Strategy;
