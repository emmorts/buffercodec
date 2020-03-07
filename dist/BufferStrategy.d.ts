import { BufferCodec } from "./BufferCodec";
import { IStrategyBuilder } from "./strategies/IStrategyBuilder";
import { IStrategy } from "./strategies/IStrategy";
import { BufferValueTemplate, BufferTypeOptions } from "./buffer.types";
export declare class BufferStrategy {
    static strategies: IStrategyBuilder<IStrategy>[];
    /**
     * Encode value using template to provided buffer
     * @param value {any} Value to encode
     * @param template {BufferValueTemplate} Value encoding template
     * @param bufferCodec {BufferCodec} BufferCodec containing target buffer
     */
    static encode(value: any, template: BufferValueTemplate, bufferCodec: BufferCodec): void;
    /**
     * Decode value from the buffer using template
     * @param template Value decoding template
     * @param bufferCodec {BufferCodec} BufferCodec containing target buffer
     */
    static decode(template: BufferValueTemplate, bufferCodec: BufferCodec): any;
    /**
     * Retrieves a strategy for encoding and decoding the value
     * @param template {BufferValueTemplate} Value template
     * @returns {IStrategyBuilder<IStrategy>} Template codec strategy
     * @throws {Error} When strategy for provided template is not found
     */
    static getTemplateStrategy(template: BufferValueTemplate): IStrategyBuilder<IStrategy>;
    /**
     * Gets options from provided value type
     * @param type {string} Value type
     * @returns {BufferTypeOptions & { [key: string]: any }} Type options
     * @throws {Error} When type is not provided
     */
    static getTypeOptions(type: string): BufferTypeOptions & {
        [key: string]: any;
    };
    /**
     * Adds a new strategy to codec
     * @param strategy {IStrategyBuilder<IStrategy>}
     */
    static addStrategy(strategy: IStrategyBuilder<IStrategy>): void;
}
