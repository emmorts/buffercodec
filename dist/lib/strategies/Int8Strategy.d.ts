import { BufferCodec } from "../BufferCodec";
import { BufferValueTemplate } from '../buffer.types';
import { StrategyBase } from "./StrategyBase";
export default class Int8Strategy implements StrategyBase {
    static supports(template: BufferValueTemplate): boolean;
    static encode(value: any, template: BufferValueTemplate, codec: BufferCodec): void;
    static decode(template: BufferValueTemplate, codec: BufferCodec): any;
}
