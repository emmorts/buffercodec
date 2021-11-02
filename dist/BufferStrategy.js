"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BufferStrategy = void 0;
const strategies_1 = require("./strategies");
class BufferStrategy {
    /**
     * Encode value using template to provided buffer
     * @param value Value to encode
     * @param template Value encoding template
     * @param bufferCodec BufferCodec containing target buffer
     */
    static encode(value, template, bufferCodec) {
        const strategy = this.getTemplateStrategy(template);
        return strategy.encode(value, template, bufferCodec);
    }
    /**
     * Decode value from the buffer using template
     * @param template Value decoding template
     * @param bufferCodec BufferCodec containing target buffer
     * @returns Decoded value
     */
    static decode(template, bufferCodec) {
        const strategy = this.getTemplateStrategy(template);
        return strategy.decode(template, bufferCodec);
    }
    /**
     * Retrieves a strategy for encoding and decoding the value
     * @param template Value template
     * @returns Template codec strategy
     * @throws {Error} When strategy for provided template is not found
     */
    static getTemplateStrategy(template) {
        const strategy = this.strategies.find(s => s.supports(template));
        if (!strategy) {
            throw new Error(`Strategy for provided template '${template}' was not found`);
        }
        return strategy;
    }
    /**
     * Gets options from provided value type
     * @param type Value type
     * @returns Type options
     * @throws {Error} When type is not provided
     */
    static getTypeOptions(type) {
        if (!type) {
            throw new Error('Type was not provided');
        }
        const fragments = type.split('|');
        const objectType = fragments.shift();
        const isNullable = objectType.charAt(objectType.length - 1) === '?';
        const options = {
            type: objectType.replace('?', ''),
            nullable: isNullable
        };
        fragments.forEach((fragment) => {
            if (fragment === 'utf8') {
                options.encoding = 'utf8';
            }
            else if (fragment === 'utf16') {
                options.encoding = 'utf16';
            }
            options[fragment] = true;
        });
        return options;
    }
    /**
     * Adds new strategies to codec
     * @param strategies Strategies to add
     */
    static add(...strategies) {
        this.strategies.push(...strategies.map(StrategyRef => new StrategyRef()));
    }
}
exports.BufferStrategy = BufferStrategy;
/** @internal */
BufferStrategy.strategies = [...strategies_1.default.map(StrategyRef => new StrategyRef())];
