import { BufferCodec } from "./BufferCodec";
import { BufferValueTemplate, BufferTypeOptions } from "./Buffer.types";
import { StrategyBase } from "./strategies/StrategyBase";
export declare class BufferStrategy {
    /** @internal */
    static strategies: StrategyBase[];
    /**
     * Encode value using template to provided buffer
     * @param value Value to encode
     * @param template Value encoding template
     * @param bufferCodec BufferCodec containing target buffer
     */
    static encode(value: any, template: BufferValueTemplate, bufferCodec: BufferCodec): void;
    /**
     * Decode value from the buffer using template
     * @param template Value decoding template
     * @param bufferCodec BufferCodec containing target buffer
     * @returns Decoded value
     */
    static decode(template: BufferValueTemplate, bufferCodec: BufferCodec): any;
    /**
     * Retrieves a strategy for encoding and decoding the value
     * @param template Value template
     * @returns Template codec strategy
     * @throws {Error} When strategy for provided template is not found
     */
    static getTemplateStrategy(template: BufferValueTemplate): StrategyBase;
    /**
     * Gets options from provided value type
     * @param type Value type
     * @returns Type options
     * @throws {Error} When type is not provided
     */
    static getTypeOptions(type: string): BufferTypeOptions & {
        [key: string]: any;
    };
    /**
     * Adds new strategies to codec
     * @param strategies Strategies to add
     */
    static add(...strategies: {
        new (): StrategyBase;
    }[]): void;
}
