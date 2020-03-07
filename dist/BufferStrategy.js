"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const strategies_1 = require("./strategies");
class BufferStrategy {
    static getEncodeJobs(value, template) {
        const strategy = this.getTemplateStrategy(template);
        return strategy.encode(value, template);
    }
    static decode(template, bufferCodec) {
        const strategy = this.getTemplateStrategy(template);
        return strategy.decode(template, bufferCodec);
    }
    static getTemplateStrategy(template) {
        const strategy = this.strategies.find(s => s.supports(template));
        if (!strategy) {
            throw new Error(`Strategy for provided template '${template}' was not found`);
        }
        return strategy;
    }
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
    static addStrategy(strategy) {
        this.strategies.push(strategy);
    }
}
exports.BufferStrategy = BufferStrategy;
BufferStrategy.strategies = [...strategies_1.Strategies];
