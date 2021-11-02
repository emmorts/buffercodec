import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from "../Buffer.types";
export declare abstract class StrategyBase<T = any> {
    /**
     * Determines whether strategy is able to encode and decode provided template
     * @param template Value encoding template
     */
    supports(template: BufferValueTemplate): boolean;
    /**
     * Encode value using template to provided buffer
     * @param value Value to encode
     * @param template Value encoding template
     * @param bufferCodec BufferCodec containing target buffer
     */
    encode(value: T, template: BufferValueTemplate, codec: BufferCodec): void;
    /**
     * Decode value from the buffer using template
     * @param template Value decoding template
     * @param bufferCodec BufferCodec containing target buffer
     * @returns Decoded value
     */
    decode(template: BufferValueTemplate, codec: BufferCodec): T | null;
}
