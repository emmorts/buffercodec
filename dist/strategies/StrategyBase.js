"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.StrategyBase = void 0;
class StrategyBase {
    /**
     * Determines whether strategy is able to encode and decode provided template
     * @param template Value encoding template
     */
    supports(template) {
        throw new Error(`supports() method not implemented on ${this.constructor.name}`);
    }
    /**
     * Encode value using template to provided buffer
     * @param value Value to encode
     * @param template Value encoding template
     * @param bufferCodec BufferCodec containing target buffer
     */
    encode(value, template, codec) {
        throw new Error(`encode() method not implemented on ${this.constructor.name}`);
    }
    /**
     * Decode value from the buffer using template
     * @param template Value decoding template
     * @param bufferCodec BufferCodec containing target buffer
     * @returns Decoded value
     */
    decode(template, codec) {
        throw new Error(`decode() method not implemented on ${this.constructor.name}`);
    }
}
exports.StrategyBase = StrategyBase;
