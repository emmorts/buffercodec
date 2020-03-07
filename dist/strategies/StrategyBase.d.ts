import { BufferCodec } from "../BufferCodec";
import { IStrategy } from "./IStrategy";
import { BufferValueTemplate } from "../buffer.types";
export declare abstract class StrategyBase implements IStrategy {
    static supports(template: BufferValueTemplate): boolean;
    static encode(value: any, template: BufferValueTemplate, codec: BufferCodec): void;
    static decode(template: BufferValueTemplate, codec: BufferCodec): any;
}
