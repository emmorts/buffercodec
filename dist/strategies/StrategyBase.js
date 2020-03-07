"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class StrategyBase {
    static supports(template) {
        throw new Error(`supports() method not implemented on ${this.constructor.name}`);
    }
    static encode(value, template, codec) {
        throw new Error(`encode() method not implemented on ${this.constructor.name}`);
    }
    static decode(template, codec) {
        throw new Error(`decode() method not implemented on ${this.constructor.name}`);
    }
}
exports.StrategyBase = StrategyBase;
