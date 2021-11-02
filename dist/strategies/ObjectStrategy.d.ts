import { BufferValueTemplate } from "../Buffer.types";
import { BufferCodec } from "../BufferCodec";
import { StrategyBase } from './StrategyBase';
export default class ObjectStrategy implements StrategyBase {
    supports(template: BufferValueTemplate): boolean;
    encode(value: any, template: BufferValueTemplate, codec: BufferCodec): void;
    decode(template: BufferValueTemplate, codec: BufferCodec): any;
}
