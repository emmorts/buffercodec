"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class UInt8Strategy {
    static supports(template) {
        return typeof (template) === 'string' && template === 'uint8';
    }
    static encode(value, template, codec) {
        codec.uint8(value);
    }
    static decode(template, codec) {
        return codec.decode({ type: 'uint8' });
    }
}
exports.default = UInt8Strategy;
