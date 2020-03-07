"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategies_1 = require("./strategies");
class BufferStrategy {
    /**
     * Encode value using template to provided buffer
     * @param value {any} Value to encode
     * @param template {BufferValueTemplate} Value encoding template
     * @param bufferCodec {BufferCodec} BufferCodec containing target buffer
     */
    static encode(value, template, bufferCodec) {
        const strategy = this.getTemplateStrategy(template);
        return strategy.encode(value, template, bufferCodec);
    }
    /**
     * Decode value from the buffer using template
     * @param template Value decoding template
     * @param bufferCodec {BufferCodec} BufferCodec containing target buffer
     */
    static decode(template, bufferCodec) {
        const strategy = this.getTemplateStrategy(template);
        return strategy.decode(template, bufferCodec);
    }
    /**
     * Retrieves a strategy for encoding and decoding the value
     * @param template {BufferValueTemplate} Value template
     * @returns {IStrategyBuilder<IStrategy>} Template codec strategy
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
     * @param type {string} Value type
     * @returns {BufferTypeOptions & { [key: string]: any }} Type options
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
     * Adds a new strategy to codec
     * @param strategy {IStrategyBuilder<IStrategy>}
     */
    static addStrategy(strategy) {
        this.strategies.push(strategy);
    }
}
exports.BufferStrategy = BufferStrategy;
BufferStrategy.strategies = [...strategies_1.Strategies];
